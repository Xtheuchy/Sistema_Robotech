import axios from "axios";

//URL de la API
const URL_API = "http://localhost:8080/api/sede"

//Listar sedes
const listarSedes = async () =>{
    try {
        const response = await axios.get(URL_API);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar sedes';
    }
}
//Registrar sede
const registrarSede = async (sede) =>{
    try {
        const response = await axios.post(`${URL_API}/registrar`, sede)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al registrar sede';
    }
}

//Eliminar sede

const eliminarSede = async (id) =>{
    try {
        const response = await axios.delete(`${URL_API}/eliminar/${id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al eliminar sede';
    }
}
//Modificar sede
const actualizarSede = async (id, sede) =>{
    try {
        const response = await axios.put(`${URL_API}/modificar/${id}`, sede);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al actualizar sede';
    }
}
export const sedeServicio = {
    listarSedes,
    registrarSede,
    eliminarSede,
    actualizarSede
}

