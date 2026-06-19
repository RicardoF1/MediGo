from src.core.database import supabase
from typing import Optional

def obtener_usuario_por_correo(correo: str) -> Optional[dict]:
    """
    Busca un usuario activo cruzando la relación con su rol.
    """
    resultado = supabase.table("usuarios") \
        .select("id_usuario, nombre, correo, password_hash, activo, roles(nombre_rol)") \
        .eq("correo", correo) \
        .eq("activo", True) \
        .execute()

    if len(resultado.data) == 0:
        return None

    return resultado.data[0]