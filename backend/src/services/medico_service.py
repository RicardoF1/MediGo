from src.repository.medico_repository import MedicoRepository
from src.schema.medico_schema import EstadoCitaUpdate
from typing import List

class MedicoService:
    def __init__(self):
        self.medico_repository = MedicoRepository()

    def listar_agenda_medico(self, id_usuario_medico: int) -> List[dict]:
        # Aquí puedes agregar lógica como filtrar citas ya canceladas hace meses, etc.
        return self.medico_repository.obtener_citas_por_medico(id_usuario_medico)

    def modificar_estado_cita(self, id_cita: int, data: EstadoCitaUpdate) -> dict:
        # Aquí podrías validar que un médico no complete una cita programada para el futuro
        return self.medico_repository.actualizar_estado_cita(id_cita, data)