from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from src.schema.cita_schema import ReservaCitaRequest, ReservaCitaResponse, EspecialidadLookup, MedicoLookup, HistorialCitaResponse
from src.repository.cita_repository import CitaRepository
from src.core.security import SecurityHandler

router = APIRouter(prefix="/api/citas", tags=["Módulo Citas y Reservas"])
_repo = CitaRepository()
security_bearer = HTTPBearer()

async def obtener_id_usuario_logeado(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> int:
    token_string = credentials.credentials
    payload = SecurityHandler.decodificar_jwt(token_string)
    id_usuario: int = payload.get("id")
    if not id_usuario:
        raise HTTPException(status_code=401, detail="Sesión inválida.")
    return id_usuario

# 1. GET: Cargar especialidades al abrir la pantalla
@router.get("/especialidades", response_model=List[EspecialidadLookup])
async def obtener_especialidades():
    return _repo.listar_especialidades()

# 2. GET: Cargar médicos según la especialidad seleccionada
@router.get("/medicos/{especialidad_id}", response_model=List[MedicoLookup])
async def obtener_medicos_por_especialidad(especialidad_id: int):
    return _repo.listar_medicos_por_especialidad(especialidad_id)

# 3. POST: Confirmar la reserva con todos los campos
@router.post("/reservar", response_model=ReservaCitaResponse)
async def reservar_cita(payload: ReservaCitaRequest, id_usuario: int = Depends(obtener_id_usuario_logeado)):
    id_paciente = _repo.obtener_id_paciente_por_usuario(id_usuario)
    if not id_paciente:
        raise HTTPException(status_code=400, detail="Usuario no asociado a un perfil de paciente.")
    
    try:
        id_cita = _repo.crear_reserva_cita(id_paciente, payload)
        return {
            "status": "success",
            "message": "¡Cita registrada exitosamente!",
            "idCita": id_cita
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/historial", response_model=List[HistorialCitaResponse])
async def obtener_historial(id_usuario: int = Depends(obtener_id_usuario_logeado)):
    # Reutilizamos tu servicio
    from src.services.cita_service import CitaService
    service = CitaService()
    return service.get_historial_paciente(id_usuario)