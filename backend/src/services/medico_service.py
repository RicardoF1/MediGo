from src.repository.medico_repository import MedicoRepository
from src.schema.medico_schema import EstadoCitaUpdate, PerfilMedicoUpdate
from typing import List

class MedicoService:
    def __init__(self):
        self.medico_repository = MedicoRepository()

    def listar_agenda_medico(self, id_usuario_medico: int) -> List[dict]:
        # Capa lógica para el listado de citas
        return self.medico_repository.obtener_citas_por_medico(id_usuario_medico)

    def modificar_estado_cita(self, id_cita: int, data: EstadoCitaUpdate) -> dict:
        # Capa lógica para transiciones de estados clínicos
        return self.medico_repository.actualizar_estado_cita(id_cita, data) 

    # ===  PERFIL MÉDICO ===

    def obtener_perfil_clinico(self, id_usuario_medico: int) -> dict:
        """
        Solicita al repositorio el perfil aplanado del médico.
        Aquí podrías formatear textos adicionales si fuera necesario.
        """
        return self.medico_repository.obtener_perfil_medico(id_usuario_medico)

    def modificar_perfil_clinico(self, id_usuario_medico: int, data: PerfilMedicoUpdate) -> dict:
        """
        Procesa la actualización de datos personales y profesionales del médico.
        """
        # Aquí podrías meter lógica de negocio en el futuro (ej. validar formato de colegiatura)
        return self.medico_repository.actualizar_perfil_medico(id_usuario_medico, data)