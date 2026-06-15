from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class PerfilPacienteResponse(BaseModel):
    idPaciente: int
    nombreCompleto: str
    dni: str
    fechaNacimiento: date
    correo: EmailStr
    telefono: Optional[str] = None
    historialClinicoNum: str
    direccionResidencia: Optional[str] = None
    grupoSanguineo: Optional[str] = None
    contactoEmergenciaNombre: Optional[str] = None
    contactoEmergenciaTelefono: Optional[str] = None

class PerfilPacienteUpdate(BaseModel):
    nombreCompleto: str
    correo: EmailStr
    telefono: Optional[str] = None
    direccionResidencia: Optional[str] = None
    grupoSanguineo: Optional[str] = None
    contactoEmergenciaNombre: Optional[str] = None
    contactoEmergenciaTelefono: Optional[str] = None