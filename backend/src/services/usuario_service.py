from fastapi import HTTPException, status
import bcrypt
from typing import List

# Importamos las funciones del repositorio de usuarios
from src.repository.usuario_repository import (
    listar_todos,
    buscar_por_correo,
    crear_usuario
)

# Importamos las funciones para inicializar perfiles específicos de rol
from src.repository.medico_repository import crear_perfil_medico_base
from src.repository.paciente_repository import crear_perfil_paciente_base

from src.schema.usuario_schema import UsuarioCreate, UsuarioResponse

class UsuarioService:

    def obtener_usuarios(self) -> List[UsuarioResponse]:
        usuarios_db = listar_todos()
        return [UsuarioResponse.from_orm(u) for u in usuarios_db]

    def registrar_usuario(self, esquema: UsuarioCreate) -> UsuarioResponse:
        # 1. Validar si el correo ya está registrado
        existe = buscar_por_correo(esquema.correo.lower().strip())
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya se encuentra registrado"
            )

        # 2. Encriptar la contraseña con bcrypt real
        salt = bcrypt.gensalt()
        password_encriptada = bcrypt.hashpw(esquema.password.encode('utf-8'), salt).decode('utf-8')

        # 3. Preparar diccionario para la tabla core 'usuarios'
        nuevo_usuario_data = {
            "nombre": esquema.nombre,
            "correo": esquema.correo.lower().strip(),
            "password_hash": password_encriptada,
            "id_rol": esquema.id_rol,
            "activo": True
        }

        # 4. Guardar en la tabla 'usuarios'
        usuario_creado = crear_usuario(nuevo_usuario_data)
        nuevo_id_usuario = usuario_creado.get("id_usuario")


        try:
            if esquema.id_rol == 11:    # 11 = MEDICO
                crear_perfil_medico_base(nuevo_id_usuario)
            elif esquema.id_rol == 12:  # 12 = PACIENTE
                crear_perfil_paciente_base(nuevo_id_usuario)
            # Si es Administrador (10), no requiere inserción en tablas clínicas
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Usuario creado, pero falló la inicialización de su rol clínico: {str(e)}"
            )

        # 6. Retornar la respuesta mapeada con Pydantic
        return UsuarioResponse.from_orm(usuario_creado)