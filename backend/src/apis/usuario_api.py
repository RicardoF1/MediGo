from fastapi import APIRouter, Depends, status
from typing import List
from src.schema.usuario_schema import UsuarioCreate, UsuarioResponse
from src.services.usuario_service import UsuarioService

router = APIRouter(prefix="/usuarios", tags=["Gestión de Usuarios"])

@router.get("", response_model=List[UsuarioResponse], status_code=status.HTTP_200_OK)
def listar_usuarios(servicio: UsuarioService = Depends()):
    return servicio.obtener_usuarios()

@router.post("", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def crear_usuario(payload: UsuarioCreate, servicio: UsuarioService = Depends()):
    return servicio.registrar_usuario(payload)