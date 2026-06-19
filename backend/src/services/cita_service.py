from src.repository.cita_repository import (
    obtener_id_paciente_por_usuario,
    crear_reserva_cita,
    obtener_historial_paciente,
    obtener_resumen_dashboard,
    listar_especialidades,
    listar_medicos_por_especialidad,
)
from src.schema.cita_schema import ReservaCitaRequest

class CitaService:
    # ❌ BORRAMOS: El método __init__ y el self.cita_repository ya no son necesarios

    def reservar_nueva_cita(self, id_usuario: int, datos: ReservaCitaRequest) -> dict:
        # 1. Conseguimos el ID del paciente real llamando a la función directa
        id_paciente = obtener_id_paciente_por_usuario(id_usuario)
        if not id_paciente:
            return {"status": "error", "message": "El usuario no tiene un perfil de paciente asignado."}

        # 2. Registramos la cita
        try:
            id_cita = crear_reserva_cita(id_paciente, datos)
            return {
                "status": "success",
                "message": "¡Cita reservada exitosamente de forma real!",
                "idCita": id_cita
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_historial_paciente(self, id_usuario: int) -> list:
        id_paciente = obtener_id_paciente_por_usuario(id_usuario)
        if not id_paciente:
            return []
        return obtener_historial_paciente(id_paciente)

    def get_resumen_paciente(self, id_usuario: int) -> dict:
        id_paciente = obtener_id_paciente_por_usuario(id_usuario)
        if not id_paciente:
            return {"citasActivas": 0, "atencionesConcluidas": 0}
            
        return obtener_resumen_dashboard(id_paciente)

    def obtener_catalogo_especialidades(self) -> list:
        return listar_especialidades()

    def obtener_medicos_por_rama(self, id_especialidad: int) -> list:
        return listar_medicos_por_especialidad(id_especialidad)