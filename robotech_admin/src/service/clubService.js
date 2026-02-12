import axios from "axios";

//URL de la API
const URL_API = "https://robotech-backend-v456.onrender.com/api/club"

//Listar clubes

const listarClubes = async () => {
    try {
        const response = await axios.get(URL_API)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar clubes';
    }
}

//Obtener club por id
const obtenerClubPorId = async (id) => {
    try {
        const response = await axios.get(`${URL_API}/obtenerClub/${id}`);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al obtener club';
    }
}
//Listar integrantes del club
const listarIntegrantes = async (id) => {
    try {
        const response = await axios.get(`${URL_API}/integrantes/${id}`);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al obtener integrantes del club';
    }
}

//Validar club
const validarClub = async (validacion) => {
    try {
        const response = await axios.put(`${URL_API}/validacion`, validacion)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al validar club';
    }
}



export const clubServicio = {
    listarClubes,
    obtenerClubPorId,
    listarIntegrantes,
    validarClub
}
