from pydantic import BaseModel
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
    id_estado: int  # Pasamos el ID del catálogo estados_cita (ej. 2 para COMPLETADA, 3 para CANCELADA)