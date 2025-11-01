import axios from 'axios';
// La URL base de tu API de Spring Boot
// (Asegúrate de que sea el puerto correcto, usualmente 8080)
const API_URL = 'http://localhost:8080/api/usuarios';

/**
 * 3. Lista todos los usuarios (GET /)
 * Devuelve una lista de UsuarioDTO
 */

const listarUsuarios = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Retorna el array [UsuarioDTO, ...]
    } catch (error) {
        // Lanza el mensaje de error del backend si existe, o uno genérico
        throw error.response?.data || error.message || 'Error al listar usuarios';
    }
};

/**
 * 4. Obtiene un usuario por su ID (GET /{id})
 * Devuelve un objeto Usuario
 */
const obtenerUsuarioPorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data; // Retorna el objeto {Usuario}
    } catch (error) {
        throw error.response?.data || error.message || 'Usuario no encontrado';
    }
};

/**
 * 1. Registra un nuevo usuario (POST /registrar)
 * Recibe un objeto RegistroDTO
 * Devuelve el Usuario creado
 */
const registrarUsuario = async (registroDTO) => {
    try {
        const response = await axios.post(`${API_URL}/registrar`, registroDTO);
        return response.data; // Retorna el {Usuario} creado
    } catch (error) {
        throw error.response?.data || error.message || 'Error al registrar usuario';
    }
};

/**
 * 2. Actualiza un usuario (PUT /{id})
 * Recibe el ID y el objeto Usuario completo
 * Devuelve el Usuario actualizado
 */
const actualizarUsuario = async (id, usuario) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, usuario);
        return response.data; // Retorna el {Usuario} actualizado
    } catch (error) {
        throw error.response?.data || error.message || 'Error al actualizar usuario';
    }
};

/**
 * 5. Elimina un usuario por ID (DELETE /{id})
 */
const eliminarUsuario = async (id) => {
    try {
        // DELETE no suele devolver contenido, solo un estado 204
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw error.response?.data || error.message || 'Error al eliminar usuario';
    }
};

// Exportamos todas las funciones como un objeto
export const usuarioServicio = {
    listarUsuarios,
    obtenerUsuarioPorId,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario
};