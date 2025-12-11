import axios from 'axios';
// La URL base de tu API de Spring Boot
// (Asegúrate de que sea el puerto correcto, usualmente 8080)
const API_URL = 'http://localhost:8080/api/usuarios';

/**
 1. Lista todos los usuarios
 Devuelve una lista de UsuarioDTO
 */

const listarUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/listar`);
        return response.data; // Retorna el array [UsuarioDTO, ...]
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar usuarios';
    }
};

/**
 2. Obtiene un usuario por su ID
 Devuelve un objeto Usuario
 */
const obtenerUsuarioPorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data; // Retorna el objeto Usuario
    } catch (error) {
        throw error.response?.data || error.message || 'Usuario no encontrado';
    }
};

/**
 3. Registra un nuevo usuario
 Devuelve el Usuario creado
 */
const registrarUsuario = async (registroDTO) => {
    try {
        const response = await axios.post(`${API_URL}/registrar`, registroDTO);
        return response.data; // Retorna el Usuario creado
    } catch (error) {
        throw error.response?.data || error.message || 'Error al registrar usuario';
    }
};

/**
 4. Actualiza un usuario
 Devuelve el Usuario actualizado
 */
const actualizarUsuario = async (id, usuario) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, usuario);
        return response.data; // Retorna el Usuario actualizado
    } catch (error) {
        throw error.response?.data || error.message || 'Error al actualizar usuario';
    }
};

/**
 5. Elimina un usuario por ID
 */
const eliminarUsuario = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw error.response?.data || error.message || 'Error al eliminar usuario';
    }
};

/**
 6. Listar jueces
 */
const listarJueces = async () =>{
    try {
        const response = await axios.get(`${API_URL}/jueces`);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar jueces';
    }
}



// Exportamos todas las funciones como un objeto
export const usuarioServicio = {
    listarUsuarios,
    obtenerUsuarioPorId,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    listarJueces
};