from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials # <-- Nueva herramienta de FastAPI
from src.schema.medico_schema import AgendaMedicoResponse, EstadoCitaUpdate
from src.services.medico_service import MedicoService
from src.core.security import SecurityHandler # <-- Importamos el Handler de Seguridad
from typing import List

router = APIRouter(
    prefix="/api/medico",
    tags=["Módulo Médico"]
)

_medico_service = MedicoService()
# Instanciamos el lector de tokens de FastAPI
security_bearer = HTTPBearer()

async def obtener_id_medico_logeado(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> int:
    """
    Dependencia que intercepta el Bearer token, lo decodifica y 
    devuelve dinámicamente el ID real del usuario en sesión.
    """
    token_string = credentials.credentials
    # Desencriptamos usando nuestro Handler actualizado
    payload = SecurityHandler.decodificar_jwt(token_string)
    
    # Extraemos el campo "id" que tu AuthService guardó al hacer Login
    id_usuario: int = payload.get("id")
    
    if not id_usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token no contiene una identidad de usuario válida."
        )
        
    return id_usuario


@router.get("/agenda", response_model=List[AgendaMedicoResponse])
async def obtener_agenda(id_usuario: int = Depends(obtener_id_medico_logeado)):
    """
    Ahora 'id_usuario' cambia dinámicamente según quién use la aplicación
    """
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