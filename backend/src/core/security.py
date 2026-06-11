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