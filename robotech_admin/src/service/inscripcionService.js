import axios from "axios";

//URL api torneo
const API_URL = "https://robotech-backend-v456.onrender.com/api/inscripcion";

//Listar inscripciones por torneo
const listarInscripcionPorTorneo = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar inscripciones del torneo';
    }
}
export const inscripcionServicio = {
    listarInscripcionPorTorneo
}
