import jwt
from datetime import datetime, timedelta, timezone
import bcrypt
from src.core.config import settings

class SecurityHandler:
    @staticmethod
    def verificar_password(plain_password: str, hashed_password: str) -> bool:
        # Intenta verificar usando Bcrypt real
        try:
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        except ValueError:
            # Si el hash en la BD es de prueba o texto plano, cae aquí y compara directo
            return plain_password == hashed_password

    @staticmethod
    def generar_jwt(datos: dict) -> str:
        expiracion = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
        payload = {
            **datos,
            "exp": expiracion
        }
        return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

    # --- NUEVO MÉTODO AGREGADO ---
    @staticmethod
    def decodificar_jwt(token: str) -> dict:
        """
        Desencripta el token JWT enviado por Angular. 
        Si expiró o está corrupto, corta la petición con un error 401.
        """
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="El token de sesión ha expirado. Inicie sesión nuevamente."
            )
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales de acceso inválidas o alteradas."
            )