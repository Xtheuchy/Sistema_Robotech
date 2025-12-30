import axiosInstance from './axiosConfig';

/**
 * Servicio para consulta de Enfrentamientos
 */

/**
 * Listar enfrentamientos de un torneo
 * @param {number} idTorneo - ID del torneo
 * @returns {Promise<EnfrentamientoDTO[]>}
 */
export const listarEnfrentamientosPorTorneo = async (idTorneo) => {
    const response = await axiosInstance.get(`/api/enfrentamientos/listar/${idTorneo}`);
    return response.data;
};

export default {
    listarEnfrentamientosPorTorneo,
};
