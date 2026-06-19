from src.core.database import supabase
from src.schema.paciente_schema import PerfilPacienteUpdate

# =========================================================
#  GESTIÓN DE PERFIL CLÍNICO DEL PACIENTE
# =========================================================

def obtener_perfil_paciente(id_usuario_paciente: int) -> dict:
    """
    Recupera el perfil completo del paciente cruzando 'pacientes' y 'usuarios'.
    """
    respuesta = supabase.table("pacientes") \
        .select("""
            id_paciente,
            dni,
            fecha_nacimiento,
            telefono,
            historial_clinico_num,
            direccion_residencia,
            grupo_sanguineo,
            contacto_emergencia_nombre,
            contacto_emergencia_telefono,
            usuarios (
                nombre,
                correo
            )
        """) \
        .eq("id_usuario", id_usuario_paciente) \
        .execute()

    if not respuesta.data:
        return {}

    item = respuesta.data[0]
    usuario_data = item.get("usuarios", {}) or {}

    return {
        "idPaciente": item.get("id_paciente"),
        "nombreCompleto": usuario_data.get("nombre", "Paciente Sistema"),
        "dni": item.get("dni", ""),
        "fechaNacimiento": item.get("fecha_nacimiento"),
        "correo": usuario_data.get("correo", ""),
        "telefono": item.get("telefono") or "",
        "historialClinicoNum": item.get("historial_clinico_num", ""),
        "direccionResidencia": item.get("direccion_residencia") or "",
        "grupoSanguineo": item.get("grupo_sanguineo") or "O+",
        "contactoEmergenciaNombre": item.get("contacto_emergencia_nombre") or "",
        "contactoEmergenciaTelefono": item.get("contacto_emergencia_telefono") or ""
    }


def actualizar_perfil_paciente(id_usuario_paciente: int, data: PerfilPacienteUpdate) -> dict:
    """
    Actualiza los datos core en 'usuarios' y toda la información de contacto/emergencia en 'pacientes'.
    """
    # 1. Actualizamos datos en la tabla core de usuarios
    supabase.table("usuarios") \
        .update({
            "nombre": data.nombreCompleto,
            "correo": data.correo
        }) \
        .eq("id_usuario", id_usuario_paciente) \
        .execute()

    # 2. Actualizamos la tabla de pacientes con todos los campos del formulario
    supabase.table("pacientes") \
        .update({
            "telefono": data.telefono,
            "direccion_residencia": data.direccionResidencia,
            "grupo_sanguineo": data.grupoSanguineo,
            "contacto_emergencia_nombre": data.contactoEmergenciaNombre,
            "contacto_emergencia_telefono": data.contactoEmergenciaTelefono
        }) \
        .eq("id_usuario", id_usuario_paciente) \
        .execute()

    return {"status": "success", "message": "Perfil de paciente actualizado correctamente"}


def crear_perfil_paciente_base(id_usuario: int) -> dict:
    """Crea un registro inicial para el paciente incluyendo un DNI por defecto para evitar el error NOT NULL."""
    resultado = supabase.table("pacientes") \
        .insert({
            "id_usuario": id_usuario, 
            "dni": f"PENDIENTE-{id_usuario}",  
            "fecha_nacimiento": "2000-01-01",
            "historial_clinico_num": f"HC-{id_usuario}",
            "grupo_sanguineo": "O+"
        }) \
        .execute()
    return resultado.data[0]