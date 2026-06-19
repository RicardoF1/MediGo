from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from typing import List

# Importaciones de esquemas y dependencias
from src.schema.cita_schema import (
    ReservaCitaRequest, ReservaCitaResponse, 
    EspecialidadLookup, MedicoLookup, 
    HistorialCitaResponse, ResumenDashboard
)
from src.services.cita_service import CitaService
from src.core.security import SecurityHandler

router = APIRouter(prefix="/api/citas", tags=["Módulo Citas y Reservas"])

# Instancia única del servicio (El repositorio ya no se instancia aquí)
_service = CitaService() 
security_bearer = HTTPBearer()

async def obtener_id_usuario_logeado(credentials = Depends(security_bearer)) -> int:
    token_string = credentials.credentials
    payload = SecurityHandler.decodificar_jwt(token_string)
    id_usuario = payload.get("id")
    if not id_usuario:
        raise HTTPException(status_code=401, detail="Sesión inválida.")
    return id_usuario

# 1. GET: Especialidades
@router.get("/especialidades", response_model=List[EspecialidadLookup])
async def obtener_especialidades():
    # 🔄 CORREGIDO: Ahora pasa por el Service en lugar de ir directo al Repo
    return _service.obtener_catalogo_especialidades()

# 2. GET: Médicos por especialidad
@router.get("/medicos/{especialidad_id}", response_model=List[MedicoLookup])
async def obtener_medicos_por_especialidad(especialidad_id: int):
    # 🔄 CORREGIDO: Ahora pasa por el Service en lugar de ir directo al Repo
    return _service.obtener_medicos_por_rama(especialidad_id)

# 3. POST: Reservar
@router.post("/reservar", response_model=ReservaCitaResponse)
async def reservar_cita(payload: ReservaCitaRequest, id_usuario: int = Depends(obtener_id_usuario_logeado)):
    result = _service.reservar_nueva_cita(id_usuario, payload)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

# 4. GET: Historial
@router.get("/historial", response_model=List[HistorialCitaResponse])
async def obtener_historial(id_usuario: int = Depends(obtener_id_usuario_logeado)):
    return _service.get_historial_paciente(id_usuario)

# 5. GET: Resumen
@router.get("/resumen", response_model=ResumenDashboard)
async def obtener_resumen(id_usuario: int = Depends(obtener_id_usuario_logeado)):
    return _service.get_resumen_paciente(id_usuario)