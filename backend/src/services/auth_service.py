from fastapi import HTTPException, status
from src.repository.auth_repository import obtener_usuario_por_correo
from src.core.security import SecurityHandler
from src.schema.auth_schema import LoginRequest, LoginResponse

class AuthService:

    def autenticar_usuario(self, datos_login: LoginRequest) -> LoginResponse:
        # 1. Validar existencia del usuario
        usuario = obtener_usuario_por_correo(datos_login.correo)

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas o usuario inactivo"
            )

        # 2. Verificar la contraseña
        password_valido = SecurityHandler.verificar_password(
            datos_login.password,
            usuario["password_hash"]
        )

        if not password_valido:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )

        # 3. Convertir rol para el frontend (Extracción Segura 🛡️)
        roles_data = usuario.get("roles", {})
        
        # Por si Supabase lo devuelve como una lista [ {nombre_rol: ...} ]
        if isinstance(roles_data, list) and len(roles_data) > 0:
            rol_db = roles_data[0].get("nombre_rol", "PACIENTE")
        elif isinstance(roles_data, dict):
            rol_db = roles_data.get("nombre_rol", "PACIENTE")
        else:
            rol_db = "PACIENTE"

        # Mapeo de nombre de rol para Angular
        rol_frontend = "ADMIN" if rol_db == "ADMINISTRADOR" else rol_db

        # 4. Datos para el JWT
        payload_data = {
            "id": usuario["id_usuario"],
            "nombre": usuario["nombre"],
            "correo": usuario["correo"],
            "rol": rol_frontend
        }

        token = SecurityHandler.generar_jwt(payload_data)

        return LoginResponse(
            id=usuario["id_usuario"],
            nombre=usuario["nombre"],
            correo=usuario["correo"],
            rol=rol_frontend,
            token=token
        )