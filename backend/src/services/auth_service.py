from fastapi import HTTPException, status
from src.repository.auth_repository import AuthRepository
from src.core.security import SecurityHandler
from src.schema.auth_schema import LoginRequest, LoginResponse

class AuthService:
    def __init__(self):
        self.repository = AuthRepository()

    def autenticar_usuario(self, datos_login: LoginRequest) -> LoginResponse:
        usuario = self.repository.obtener_usuario_por_correo(datos_login.correo)
        
        # 1. Validar existencia del usuario
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
            
        # 3. Mapear el rol para cumplir con los requisitos del Navbar del frontend
        rol_db = usuario["roles"]["nombre_rol"]
        rol_frontend = "ADMIN" if rol_db == "ADMINISTRADOR" else rol_db
        
        # 4. Preparar la data para el token y la respuesta
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