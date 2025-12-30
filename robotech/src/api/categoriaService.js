import axiosInstance from './axiosConfig';

/**
 * Servicio para consulta de Categorías de robots
 */

/**
 * Listar todas las categorías disponibles
 * @returns {Promise<CategoriaDTO[]>}
 */
export const listarCategorias = async () => {
    const response = await axiosInstance.get('/api/categoria');
    return response.data;
};

export default {
    listarCategorias,
};
