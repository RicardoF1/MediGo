from pydantic import BaseModel, EmailStr
from datetime import date, time

class AgendaMedicoResponse(BaseModel):
    id_cita: int
    id_paciente: int
    paciente_nombre: str
    fecha: date
    hora: str  # Enviamos como string para evitar líos de serialización con TIME
    estado: str  # 'PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'
    motivo: str

    class Config:
        from_attributes = True

class EstadoCitaUpdate(BaseModel):
    id_estado: int  


class PerfilMedicoUpdate(BaseModel):
    nombreCompleto: str
    colegiatura: str
    especialidad: str
    correo: EmailStr
    telefono: str
    consultorio: str
    activoParaCitas: bool

class PerfilMedicoResponse(BaseModel):
    nombreCompleto: str
    colegiatura: str
    especialidad: str
    correo: EmailStr
    telefono: str
    consultorio: str
    activoParaCitas: bool