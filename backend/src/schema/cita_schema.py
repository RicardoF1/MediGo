from pydantic import BaseModel
from datetime import date
from typing import List

class ReservaCitaRequest(BaseModel):
    especialidadId: int
    medicoId: int
    fecha: date
    hora: str
    motivoConsulta: str

class ReservaCitaResponse(BaseModel):
    status: str
    message: str
    idCita: int

class EspecialidadLookup(BaseModel):
    idEspecialidad: int
    nombreEspecialidad: str

class MedicoLookup(BaseModel):
    idMedico: int
    nombre: str
    avatar: str
    disponibilidad: List[str]


class HistorialCitaResponse(BaseModel):
    id: int              
    fecha: str
    hora: str
    motivoConsulta: str   
    nombreMedico: str
    especialidadNombre: str 
    estado: str

class ResumenDashboard(BaseModel):
    citasActivas: int
    atencionesConcluidas: int