import axiosInstance from './axiosConfig';

/**
 * Servicio para consulta de Torneos
 */

/**
 * Listar torneos públicos (estado público/activo)
 * @returns {Promise<TorneoDTO[]>}
 */
export const listarTorneosPublicos = async () => {
    const response = await axiosInstance.get('/api/torneo/publico');
    return response.data;
};

/**
 * Obtener torneo por ID
 * @param {number} idTorneo - ID del torneo
 * @returns {Promise<TorneoDTO>}
 */
export const obtenerTorneoPorId = async (idTorneo) => {
    const response = await axiosInstance.get(`/api/torneo/torneoId/${idTorneo}`);
    return response.data;
};

/**
 * Listar enfrentamientos de un torneo
 * @param {number} torneoId - ID del torneo
 * @returns {Promise<Array>} - Lista de enfrentamientos
 */
export const listarEnfrentamientosPorTorneo = async (torneoId) => {
    const response = await axiosInstance.get(`/api/enfrentamiento/torneo/${torneoId}`);
    return response.data;
};

export default {
    listarTorneosPublicos,
    obtenerTorneoPorId,
    listarEnfrentamientosPorTorneo,
};
