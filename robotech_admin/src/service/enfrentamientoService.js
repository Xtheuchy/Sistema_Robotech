import axios from "axios";

//URL de la API
const URL_API = "http://localhost:8080/api/enfrentamientos"

//1. Listar torneos
const listarEnfrentamientoPorTorneo = async (id) => {
    try {
        const response = await axios.get(`${URL_API}/listar/${id}`);
        return response.data; 
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar Enfrentamientos';
    }
};

//2. Generar enfrentamientos de un torneo
const generarEnfrentamiento = async (id) =>{
    try{
        const response = await axios.post(`${URL_API}/generar/${id}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error.message || 'Error al generar Enfrentamientos de torneo';
    }
}

//3. generar Siguiente Ronda de un torneo
const generarSiguienteRonda = async (torneoId, rondaActual) =>{
    try {
        const response = await axios.post(`${URL_API}/siguienteRonda/${torneoId}/${rondaActual}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al generar ronda de torneo';
    }
}

//4. Registrar resultado de enfrentamiento 
const registrarResultado = async (enfrentamientoId, enfrentamientoDTO) =>{
    try {
        const response = await axios.post(`${URL_API}/resultado/${enfrentamientoId}`,enfrentamientoDTO);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al registrar resultados';
    }
}

export const enfrentamientoServicio = {
    listarEnfrentamientoPorTorneo,
    generarEnfrentamiento,
    generarSiguienteRonda,
    registrarResultado
};