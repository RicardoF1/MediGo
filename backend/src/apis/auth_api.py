from fastapi import APIRouter, Depends, status
from src.schema.auth_schema import LoginRequest, LoginResponse
from src.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(payload: LoginRequest, servicio: AuthService = Depends()):
    return servicio.autenticar_usuario(payload)