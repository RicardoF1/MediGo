from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Lo que enviará el formulario de Angular
class UsuarioCreate(BaseModel):
    nombre: str
    correo: EmailStr
    password: str
    id_rol: int  # 1: ADMIN, 2: MEDICO, 3: PACIENTE

# Lo que responderá la API para mostrar en las tablas
class UsuarioResponse(BaseModel):
    id_usuario: int
    nombre: str
    correo: str
    id_rol: int
    activo: bool
    created_at: Optional[str] = None

    class Config:
        from_attributes = True