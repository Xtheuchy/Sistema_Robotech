import axios from "axios";

//URL de la API
const URL_API = "http://localhost:8080/api/club"

//Listar clubes

const listarClubes = async () =>{
    try {
        const response = await axios.get(URL_API)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar clubes';
    }
}

export const clubServicio={
    listarClubes
}
