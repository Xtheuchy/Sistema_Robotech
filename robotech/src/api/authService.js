import axiosInstance from './axiosConfig';

/**
 * Servicio de autenticación
 * Maneja el login de competidores y dueños de club
 */

/**
 * Login para clientes (Competidores y Dueños de Club)
 * @param {Object} credentials - { correo: string, password: string }
 * @returns {Promise} - CompetidorDTO o UsuarioDTO según el rol
 */
export const loginCliente = async (credentials) => {
    const response = await axiosInstance.post('/auth/login/cliente', credentials);
    return response.data;
};

/**
 * Actualizar datos de usuario (propietario)
 * @param {number} id - ID del usuario
 * @param {Object} usuarioDTO - RegistroDTO con los datos a actualizar
 * @param {string} usuarioDTO.nombres - Nombre del usuario
 * @param {string} usuarioDTO.correo - Correo electrónico
 * @param {string} usuarioDTO.dni - DNI del usuario
 * @param {string} usuarioDTO.password - Contraseña (puede estar vacía)
 * @param {string} usuarioDTO.foto - URL de la foto
 * @param {string} usuarioDTO.rol - Rol del usuario
 * @returns {Promise} - Usuario actualizado
 */
export const actualizarUsuario = async (id, usuarioDTO) => {
    const response = await axiosInstance.put(`/api/usuarios/${id}`, usuarioDTO);
    return response.data;
};

export default {
    loginCliente,
    actualizarUsuario,
};
