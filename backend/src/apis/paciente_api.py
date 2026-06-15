# src/apis/paciente_api.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.schema.paciente_schema import PerfilPacienteResponse, PerfilPacienteUpdate
from src.services.paciente_service import PacienteService
from src.core.security import SecurityHandler

router = APIRouter(
    prefix="/api/paciente",
    tags=["Módulo Paciente"]
)

_paciente_service = PacienteService()
security_bearer = HTTPBearer()

# 1. FUNCIÓN DE INYECCIÓN
async def obtener_id_paciente_logeado(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> int:
    """
    Intercepta el token JWT, lo decodifica y devuelve el id_usuario en sesión.
    """
    token_string = credentials.credentials
    payload = SecurityHandler.decodificar_jwt(token_string)
    
    id_usuario: int = payload.get("id")
    if not id_usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token de acceso ha expirado o es inválido."
        )
    return id_usuario


# 2. ENDPOINTS QUE LA USAN
@router.get("/perfil", response_model=PerfilPacienteResponse)
async def obtener_perfil(id_usuario: int = Depends(obtener_id_paciente_logeado)): 
    try:
        resultado = _paciente_service.obtener_perfil_clinico(id_usuario)
        if not resultado:
            raise HTTPException(status_code=404, detail="No se encontró el perfil del paciente.")
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el servidor al leer el perfil: {str(e)}"
        )


@router.put("/perfil")
async def actualizar_perfil(payload: PerfilPacienteUpdate, id_usuario: int = Depends(obtener_id_paciente_logeado)):
    try:
        return _paciente_service.modificar_perfil_clinico(id_usuario, payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al modificar los datos del paciente: {str(e)}"
        )