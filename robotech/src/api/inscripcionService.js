import axiosInstance from './axiosConfig';

/**
 * Servicio para gestión de Inscripciones a torneos
 */

/**
 * Listar inscripciones de un torneo
 * @param {number} idTorneo - ID del torneo
 * @returns {Promise<InscripcionDTO[]>}
 */
export const listarInscripcionesPorTorneo = async (idTorneo) => {
    const response = await axiosInstance.get(`/api/inscripcion/${idTorneo}`);
    return response.data;
};

/**
 * Registrar inscripción a un torneo
 * @param {Object} inscripcionData - RegistroInscripcionDTO
 * @param {number} inscripcionData.torneoId - ID del torneo
 * @param {number} inscripcionData.competidorId - ID del competidor
 * @returns {Promise<Inscripcion>}
 */
export const registrarInscripcion = async (inscripcionData) => {
    const response = await axiosInstance.post('/api/inscripcion/registrar', inscripcionData);
    return response.data;
};

export default {
    listarInscripcionesPorTorneo,
    registrarInscripcion,
};
