# src/services/cita_service.py
from src.repository.cita_repository import CitaRepository
from src.schema.cita_schema import ReservaCitaRequest

class CitaService:

    def __init__(self):
        self.cita_repository = CitaRepository()

    def reservar_nueva_cita(self, id_usuario: int, datos: ReservaCitaRequest) -> dict:
        # 1. Conseguimos el ID del paciente real
        id_paciente = self.cita_repository.obtener_id_paciente_por_usuario(id_usuario)
        if not id_paciente:
            return {"status": "error", "message": "El usuario no tiene un perfil de paciente asignado."}

        # 2. Registramos la cita
        try:
            id_cita = self.cita_repository.crear_reserva_cita(id_paciente, datos)
            return {
                "status": "success",
                "message": "¡Cita reservada exitosamente de forma real!",
                "idCita": id_cita
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_historial_paciente(self, id_usuario: int) -> list:
        id_paciente = self.cita_repository.obtener_id_paciente_por_usuario(id_usuario)
        if not id_paciente:
            return []
        return self.cita_repository.obtener_historial_paciente(id_paciente)