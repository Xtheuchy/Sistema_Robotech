import axios from "axios";

//URL api torneo
const API_URL = "https://robotech-backend-v456.onrender.com/api/torneo";

//1. Registrar torneo
const registrarTorneo = async (torneo) => {
    try {
        const response = await axios.post(`${API_URL}/registrar`, torneo);
        return response.data; // Retorna el Torneo creado
    } catch (error) {
        throw error.response?.data || error.message || 'Error al registrar torneo';
    }
};
//2. Listar torneos
const listarTorneos = async () => {
    try {
        const response = await axios.get(`${API_URL}/torneos`);
        return response.data; // Retorna el array [TorneoDTO, ...]
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar Torneos publicos';
    }
};
//Obtener torneo por id
const obtenerTorneoPorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/torneoId/${id}`)
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Error al obtener torneo por id';
    }
}
//3. Listar torneos publicos
const listarTorneoPublico = async () => {
    try {
        const response = await axios.get(`${API_URL}/publico`);
        return response.data; // Retorna el array [TorneoDTO, ...]
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar Torneos publicos';
    }
};
//4. Listar torneos borrador
const listarTorneoBorrador = async () => {
    try {
        const response = await axios.get(`${API_URL}/borrador`);
        return response.data; // Retorna el array [TorneoDTO, ...]
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar Torneos borradores';
    }
};
//5. modificar estado de torneo
const actualizarEstado = async (id, nuevoEstado) => {
    try {
        const response = await axios.put(`${API_URL}/estado/${id}`, nuevoEstado);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Error al actualizar estado del torneo';
    }
}
/**
 6. Actualiza un Torneo
 Devuelve el Torneo actualizado
 */
const actualizarTorneo = async (Torneo) => {
    try {
        const response = await axios.put(`${API_URL}/modificar`, Torneo);
        return response.data; // Retorna el Torneo actualizado
    } catch (error) {
        throw error.response?.data || error.message || 'Error al actualizar Torneo';
    }
};

//Eliminar torneo
const eliminarTorneo = async (id) => {
    try {
        await axios.delete(`${API_URL}/eliminar/${id}`);
    } catch (error) {
        throw error.response?.data || error.message || 'Error al eliminar torneo';
    }
};
//Exportamos todas las funciones como un objeto
export const torneoServicio = {
    registrarTorneo,
    listarTorneoPublico,
    listarTorneoBorrador,
    actualizarEstado,
    listarTorneos,
    actualizarTorneo,
    eliminarTorneo,
    obtenerTorneoPorId
}