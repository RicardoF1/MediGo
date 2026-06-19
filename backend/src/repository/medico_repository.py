from src.core.database import supabase
from src.schema.medico_schema import EstadoCitaUpdate, PerfilMedicoUpdate
from typing import List, Dict

# =========================================================
#  GESTIÓN DE AGENDA Y CITAS MÉDICAS
# =========================================================

def obtener_citas_por_medico(id_usuario_medico: int) -> List[dict]:
    """
    1. Busca el id_medico correspondiente al id_usuario logueado.
    2. Trae sus citas cruzando los datos del paciente y el estado de la cita.
    """
    # Primero obtenemos el id_medico usando el id_usuario del token
    medico_res = supabase.table("medicos") \
        .select("id_medico") \
        .eq("id_usuario", id_usuario_medico) \
        .execute()
        
    if not medico_res.data:
        return []
        
    id_medico = medico_res.data[0]["id_medico"]

    # Traemos las citas cruzando relaciones con la sintaxis de Supabase
    respuesta = supabase.table("citas") \
        .select("""
            id_cita,
            fecha,
            hora,
            motivo,
            id_paciente,
            pacientes (
                usuarios (
                    nombre
                )
            ),
            estados_cita (
                nombre_estado
            )
        """) \
        .eq("id_medico", id_medico) \
        .order("fecha") \
        .execute()

    # Aplanamos el JSON estructurado para cumplir con el esquema del Frontend
    citas_formateadas = []
    for item in respuesta.data:
        paciente_data = item.get("pacientes", {})
        usuario_data = paciente_data.get("usuarios", {}) if paciente_data else {}
        nombre_paciente = usuario_data.get("nombre", "Paciente Desconocido") if usuario_data else "Paciente Desconocido"
        
        estado_data = item.get("estados_cita", {})
        nombre_estado = estado_data.get("nombre_estado", "PENDIENTE") if estado_data else "PENDIENTE"

        if nombre_estado == "COMPLETADA":
            nombre_estado = "ATENDIDA"

        citas_formateadas.append({
            "id_cita": item["id_cita"],
            "id_paciente": item["id_paciente"],
            "paciente_nombre": nombre_paciente,
            "fecha": item["fecha"],
            "hora": str(item["hora"]),  
            "estado": nombre_estado,
            "motivo": item["motivo"] or "Sin motivo especificado"
        })
        
    return citas_formateadas


def actualizar_estado_cita(id_cita: int, data: EstadoCitaUpdate) -> dict:
    """
    Actualiza el id_estado y retorna la cita completamente aplanada con 
    los nombres de las relaciones para que el Frontend se refresque al instante.
    """
    supabase.table("citas") \
        .update({"id_estado": data.id_estado}) \
        .eq("id_cita", id_cita) \
        .execute()
        
    respuesta = supabase.table("citas") \
        .select("""
            id_cita,
            fecha,
            hora,
            motivo,
            id_paciente,
            pacientes (
                usuarios (
                    nombre
                )
            ),
            estados_cita (
                nombre_estado
            )
        """) \
        .eq("id_cita", id_cita) \
        .execute()

    if not respuesta.data:
        return {}

    item = respuesta.data[0]
    
    paciente_data = item.get("pacientes", {})
    usuario_data = paciente_data.get("usuarios", {}) if paciente_data else {}
    nombre_paciente = usuario_data.get("nombre", "Paciente Desconocido") if usuario_data else "Paciente Desconocido"
    
    estado_data = item.get("estados_cita", {})
    nombre_estado = estado_data.get("nombre_estado", "PENDIENTE") if estado_data else "PENDIENTE"

    if nombre_estado == "COMPLETADA":
        nombre_estado = "ATENDIDA"

    return {
        "id_cita": item["id_cita"],
        "id_paciente": item["id_paciente"],
        "paciente_nombre": nombre_paciente,
        "fecha": item["fecha"],
        "hora": str(item["hora"]),
        "estado": nombre_estado,
        "motivo": item["motivo"] or "Sin motivo especificado"
    }


# =========================================================
#  GESTIÓN DE PERFIL CLÍNICO
# =========================================================

def obtener_perfil_medico(id_usuario_medico: int) -> dict:
    """
    Recupera el perfil completo del médico cruzando la tabla 'medicos',
    los datos core de 'usuarios' y el catálogo de 'especialidades'.
    """
    respuesta = supabase.table("medicos") \
        .select("""
            colegiatura,
            consultorio,
            telefono,            
            activo_para_citas,  
            usuarios (
                nombre,
                correo
            ),
            especialidades (
                nombre_especialidad
            )
        """) \
        .eq("id_usuario", id_usuario_medico) \
        .execute()

    if not respuesta.data:
        return {}

    item = respuesta.data[0]
    usuario_data = item.get("usuarios", {}) or {}
    especialidad_data = item.get("especialidades", {}) or {}

    return {
        "nombreCompleto": usuario_data.get("nombre", "Médico Sistema"),
        "colegiatura": item.get("colegiatura", "Sin Registrar"),
        "especialidad": especialidad_data.get("nombre_especialidad", "General"),
        "correo": usuario_data.get("correo", ""),
        "telefono": item.get("telefono") or "",  
        "consultorio": item.get("consultorio", "No Asignado"),
        "activoParaCitas": item.get("activo_para_citas", True) 
    }


def actualizar_perfil_medico(id_usuario_medico: int, data: PerfilMedicoUpdate) -> dict:
    """
    Modifica los datos personales existentes en la tabla 'usuarios' 
    y la información de consultorio, colegiatura, teléfono y visibilidad en 'medicos'.
    """
    # 1. Actualizamos la tabla core de usuarios (nombre y correo)
    supabase.table("usuarios") \
        .update({
            "nombre": data.nombreCompleto,
            "correo": data.correo
        }) \
        .eq("id_usuario", id_usuario_medico) \
        .execute()

    # 2. Actualizamos la tabla médica con las nuevas columnas reales
    supabase.table("medicos") \
        .update({
            "colegiatura": data.colegiatura,
            "consultorio": data.consultorio,
            "telefono": data.telefono,                
            "activo_para_citas": data.activoParaCitas  
        }) \
        .eq("id_usuario", id_usuario_medico) \
        .execute()

    return {"status": "success", "message": "Información de perfil actualizada con éxito"}


def crear_perfil_medico_base(id_usuario: int) -> dict:
    """Crea un registro inicial para el médico con la especialidad por defecto (10)."""
    resultado = supabase.table("medicos") \
        .insert({
            "id_usuario": id_usuario, 
            "id_especialidad": 10, # 10 = Medicina General
            "colegiatura": "Por Registrar",
            "consultorio": "No Asignado",
            "activo_para_citas": True
        }) \
        .execute()
    return resultado.data[0]