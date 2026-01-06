import axiosInstance from './axiosConfig';

/**
 * Servicio para gestión de Competidores
 */

/**
 * Listar todos los competidores
 * @returns {Promise<Competidor[]>}
 */
export const listarCompetidores = async () => {
    const response = await axiosInstance.get('/api/competidor/listar');
    return response.data;
};

/**
 * Registrar un nuevo competidor
 * @param {Object} competidorData - RegistroCompetidorDTO
 * @param {string} competidorData.apodo - Apodo único del competidor
 * @param {string} competidorData.codigoUnico - Código de invitación del club
 * @param {string} competidorData.nombres - Nombres completos
 * @param {string} competidorData.correo - Correo electrónico
 * @param {string} competidorData.dni - DNI del competidor
 * @param {string} competidorData.foto - URL de la foto
 * @param {string} competidorData.password - Contraseña
 * @returns {Promise<Identificador>}
 */
export const registrarCompetidor = async (competidorData) => {
    const response = await axiosInstance.post('/api/competidor/Registrar', competidorData);
    return response.data;
};

/**
 * Modificar datos de un competidor existente
 * @param {Object} competidorDTO - CompetidorDTO con los datos actualizados
 * @param {number} competidorDTO.id - ID del competidor
 * @param {string} competidorDTO.apodo - Nuevo apodo
 * @param {string} competidorDTO.nombres - Nuevos nombres
 * @param {string} competidorDTO.correo - Nuevo correo
 * @param {string} competidorDTO.dni - Nuevo DNI
 * @param {string} competidorDTO.foto - Nueva foto URL
 * @returns {Promise<CompetidorDTO>}
 */
export const modificarCompetidor = async (competidorDTO) => {
    const response = await axiosInstance.put('/api/competidor/modificar', competidorDTO);
    return response.data;
};

export default {
    registrarCompetidor,
    modificarCompetidor,
};
