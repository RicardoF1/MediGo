from fastapi import HTTPException, status
import bcrypt
from typing import List
from src.repository.usuario_repository import UsuarioRepository
from src.schema.usuario_schema import UsuarioCreate, UsuarioResponse

class UsuarioService:
    def __init__(self):
        self.repository = UsuarioRepository()

    def obtener_usuarios(self) -> List[UsuarioResponse]:
        usuarios_db = self.repository.listar_todos()
        return [UsuarioResponse.from_orm(u) for u in usuarios_db]

    def registrar_usuario(self, esquema: UsuarioCreate) -> UsuarioResponse:
        # 1. Validar si el correo ya está registrado
        existe = self.repository.buscar_por_correo(esquema.correo.lower().strip())
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya se encuentra registrado"
            )

        # 2. Encriptar la contraseña con bcrypt real
        salt = bcrypt.gensalt()
        password_encriptada = bcrypt.hashpw(esquema.password.encode('utf-8'), salt).decode('utf-8')

        # 3. Preparar diccionario para el repositorio
        nuevo_usuario_data = {
            "nombre": esquema.nombre,
            "correo": esquema.correo.lower().strip(),
            "password_hash": password_encriptada,
            "id_rol": esquema.id_rol,
            "activo": True
        }

        # 4. Guardar en Base de Datos
        usuario_creado = self.repository.crear_usuario(nuevo_usuario_data)
        return UsuarioResponse.from_orm(usuario_creado)