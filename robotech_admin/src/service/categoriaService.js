import axios from "axios";

//URL de la API
const URL_API = "http://localhost:8080/api/categoria"

//Listar categorias

const listarCategorias = async () =>{
    try {
        const response = await axios.get(URL_API);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al listar categorias';
    }
}
//Registrar categoria
const registrarCategoria = async (categoria) =>{
    try {
        const response = await axios.post(`${URL_API}/registrar`, categoria)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al registrar categoria';
    }
}

//Eliminar categoria
const eliminarCategoria = async (id) =>{
    try {
        const response = await axios.delete(`${URL_API}/eliminar/${id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al eliminar categoria';
    }
}

//Modificar Categoria
const actualizarCategoria = async (id, categoria) =>{
    try {
        const response = await axios.put(`${URL_API}/modificar/${id}`, categoria);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message || 'Error al actualizar categoria';
    }
}
export const categoriaServicio = {
    listarCategorias,
    registrarCategoria,
    eliminarCategoria,
    actualizarCategoria
}