from pydantic import BaseModel, EmailStr
from typing import Optional

# Lo que Angular nos va a enviar al hacer Login
class LoginRequest(BaseModel):
    correo: EmailStr
    password: str

# Los datos del usuario que meteremos dentro del Token JWT
class UserSessionData(BaseModel):
    id: int
    nombre: str
    correo: str
    rol: str

# La respuesta final que el AuthService de Angular necesita recibir
class LoginResponse(BaseModel):
    id: int
    nombre: str
    correo: str
    rol: str
    token: str