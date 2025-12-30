import axiosInstance from './axiosConfig';

/**
 * Servicio para gestión de Clubes
 */

/**
 * Listar todos los clubes
 * @returns {Promise<ClubDTO[]>}
 */
export const listarClubes = async () => {
    const response = await axiosInstance.get('/api/club');
    return response.data;
};

/**
 * Obtener club por ID del propietario
 * @param {number} idPropietario - ID del usuario propietario
 * @returns {Promise<ClubDTO>}
 */
export const obtenerClubPorPropietario = async (idPropietario) => {
    const response = await axiosInstance.get(`/api/club/clubPropietario/${idPropietario}`);
    return response.data;
};

/**
 * Obtener club por ID
 * @param {number} id - ID del club
 * @returns {Promise<Club>}
 */
export const obtenerClubPorId = async (id) => {
    const response = await axiosInstance.get(`/api/club/obtenerClub/${id}`);
    return response.data;
};

/**
 * Listar integrantes de un club
 * @param {number} idClub - ID del club
 * @returns {Promise<Competidor[]>}
 */
export const listarIntegrantesClub = async (idClub) => {
    const response = await axiosInstance.get(`/api/club/integrantes/${idClub}`);
    return response.data;
};

/**
 * Registrar un nuevo club
 * @param {Object} clubData - RegistroClubDTO
 * @param {string} clubData.nombres - Nombre del propietario
 * @param {string} clubData.correo - Correo del propietario
 * @param {string} clubData.dni - DNI del propietario
 * @param {string} clubData.foto - URL foto del propietario
 * @param {string} clubData.password - Contraseña
 * @param {string} clubData.nombreClub - Nombre del club
 * @param {string} clubData.direccion_fiscal - Dirección fiscal
 * @param {string} clubData.telefono - Teléfono del club
 * @param {string} clubData.logo - URL del logo del club
 * @returns {Promise<Club>}
 */
export const registrarClub = async (clubData) => {
    const response = await axiosInstance.post('/api/club/registrar', clubData);
    return response.data;
};

/**
 * Generar código de invitación para competidores
 * @param {number} idClub - ID del club
 * @returns {Promise<string>} - Código de invitación generado
 */
export const generarCodigoInvitacion = async (idClub) => {
    const response = await axiosInstance.post(`/api/club/GenerarCodigo/${idClub}`);
    return response.data;
};

/**
 * Modificar datos del club
 * @param {Object} clubData - ModificarClubDTO
 * @param {number} clubData.id - ID del club
 * @param {string} clubData.nombreClub - Nuevo nombre del club
 * @param {string} clubData.telefonoClub - Nuevo teléfono
 * @param {string} clubData.logo - Nueva URL del logo
 * @param {string} clubData.direccionClub - Nueva dirección
 * @returns {Promise<Club>}
 */
export const modificarClub = async (clubData) => {
    const response = await axiosInstance.put('/api/club/modificar', clubData);
    return response.data;
};

/**
 * Obtener club de un competidor
 * @param {number} idCompetidor - ID del competidor
 * @returns {Promise<CompetidorClubDTO>}
 */
export const obtenerClubPorCompetidor = async (idCompetidor) => {
    const response = await axiosInstance.get(`/api/club/competidorClub/${idCompetidor}`);
    return response.data;
};

export default {
    listarClubes,
    obtenerClubPorPropietario,
    obtenerClubPorId,
    listarIntegrantesClub,
    registrarClub,
    generarCodigoInvitacion,
    modificarClub,
};
