from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.schema.medico_schema import AgendaMedicoResponse, EstadoCitaUpdate, PerfilMedicoUpdate, PerfilMedicoResponse
from src.services.medico_service import MedicoService
from src.core.security import SecurityHandler
from typing import List

router = APIRouter(
    prefix="/api/medico",
    tags=["Módulo Médico"]
)

_medico_service = MedicoService()
security_bearer = HTTPBearer()

async def obtener_id_medico_logeado(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> int:
    """
    Dependencia que intercepta el Bearer token, lo decodifica y 
    devuelve dinámicamente el ID real del usuario en sesión.
    """
    token_string = credentials.credentials
    payload = SecurityHandler.decodificar_jwt(token_string)
    
    id_usuario: int = payload.get("id")
    
    if not id_usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token no contiene una identidad de usuario válida."
        )
        
    return id_usuario


@router.get("/agenda", response_model=List[AgendaMedicoResponse])
async def obtener_agenda(id_usuario: int = Depends(obtener_id_medico_logeado)):
    try:
        return _medico_service.listar_agenda_medico(id_usuario)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en servidor al procesar la agenda: {str(e)}"
        )

@router.patch("/cita/{id_cita}/estado")
async def actualizar_estado(
    id_cita: int, 
    payload: EstadoCitaUpdate, 
    id_usuario: int = Depends(obtener_id_medico_logeado)
):
    try:
        resultado = _medico_service.modificar_estado_cita(id_cita, payload)
        if not resultado:
            raise HTTPException(status_code=404, detail="La cita requerida no existe.")
        return {"status": "Estado actualizado con éxito", "data": resultado}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al mutar el estado de la cita: {str(e)}"
        )

# === PERFIL CLÍNICO ===

@router.get("/perfil", response_model=PerfilMedicoResponse)
async def obtener_perfil_medico(id_usuario: int = Depends(obtener_id_medico_logeado)):
    """
    Retorna los datos clínicos del perfil del médico autenticado.
    """
    try:
        resultado = _medico_service.obtener_perfil_clinico(id_usuario)
        if not resultado:
            raise HTTPException(status_code=404, detail="No se encontró el perfil del médico.")
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el perfil clínico: {str(e)}"
        )

@router.put("/perfil")
async def actualizar_perfil_medico(
    payload: PerfilMedicoUpdate, 
    id_usuario: int = Depends(obtener_id_medico_logeado)
):
    """
    Actualiza la información del perfil del médico en usuarios y médicos de Supabase.
    """
    try:
        resultado = _medico_service.modificar_perfil_clinico(id_usuario, payload)
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar el perfil médico: {str(e)}"
        )