from src.core.database import supabase
from typing import List, Optional

# =========================================================
#  GESTIÓN ENFOQUE FUNCIONAL - REPOSITORIO DE USUARIOS
# =========================================================

def listar_todos() -> List[dict]:
    """Trae todos los usuarios registrados ordenados por ID."""
    resultado = supabase.table("usuarios") \
        .select("id_usuario, nombre, correo, id_rol, activo, creado_en") \
        .order("id_usuario", desc=False) \
        .execute()
    return resultado.data


def buscar_por_correo(correo: str) -> Optional[dict]:
    """Busca un usuario específico mediante su correo electrónico."""
    resultado = supabase.table("usuarios") \
        .select("*") \
        .eq("correo", correo) \
        .execute()
    if len(resultado.data) == 0:
        return None
    return resultado.data[0]


def crear_usuario(datos_usuario: dict) -> dict:
    """Inserta un nuevo usuario en la base de datos central."""
    resultado = supabase.table("usuarios") \
        .insert(datos_usuario) \
        .select("id_usuario, nombre, correo, id_rol, activo, creado_en") \
        .execute()
    return resultado.data[0]