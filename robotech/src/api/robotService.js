import axiosInstance from './axiosConfig';

/**
 * Servicio para gestión de Robots
 */

/**
 * Listar todos los robots
 * @returns {Promise<Robot[]>}
 */
export const listarRobots = async () => {
    const response = await axiosInstance.get('/api/robot');
    return response.data;
};

/**
 * Listar robots de un competidor
 * @param {number} idCompetidor - ID del competidor
 * @returns {Promise<Robot[]>}
 */
export const listarRobotsPorCompetidor = async (idCompetidor) => {
    const response = await axiosInstance.get(`/api/robot/${idCompetidor}`);
    return response.data;
};

/**
 * Registrar un nuevo robot
 * @param {number} idCompetidor - ID del competidor dueño del robot
 * @param {Object} robotData - RegistroRobotDTO
 * @param {string} robotData.nombre - Nombre del robot
 * @param {string} robotData.foto - URL de la foto del robot
 * @param {string} robotData.categoria - Nombre de la categoría (ej: "Sumo", "Laberinto")
 * @returns {Promise<Robot>}
 */
export const registrarRobot = async (idCompetidor, robotData) => {
    const response = await axiosInstance.post(`/api/robot/registrar/${idCompetidor}`, robotData);
    return response.data;
};

/**
 * Eliminar un robot por ID
 * @param {number} idRobot - ID del robot a eliminar
 * @returns {Promise<string>} - Mensaje de confirmación
 */
export const eliminarRobot = async (idRobot) => {
    const response = await axiosInstance.delete(`/api/robot/eliminar/${idRobot}`);
    return response.data;
};

/**
 * Modificar un robot existente
 * @param {Object} robotData - RegistroRobotDTO with id, nombre, foto
 * @returns {Promise<Robot>}
 */
export const modificarRobot = async (robotData) => {
    const response = await axiosInstance.put('/api/robot/modificar', robotData);
    return response.data;
};

export default {
    listarRobots,
    listarRobotsPorCompetidor,
    registrarRobot,
    eliminarRobot,
    modificarRobot,
};
