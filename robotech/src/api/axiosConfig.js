import axios from 'axios';

// Configuración base de Axios para la API de Robotech
const API_BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejar errores de red o servidor
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Error de respuesta:', error.response.data);
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            console.error('Error de red: No se recibió respuesta del servidor');
        } else {
            // Error al configurar la petición
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
