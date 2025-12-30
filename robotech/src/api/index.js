/**
 * API Services - Robotech
 * 
 * Exporta todos los servicios para fácil importación
 * 
 * Uso:
 *   import { loginCliente, listarTorneosPublicos } from './api';
 *   
 *   // O importar un servicio completo:
 *   import { clubService } from './api';
 *   clubService.listarClubes();
 */

// Servicios individuales
export { loginCliente, actualizarUsuario } from './authService';

export { 
    listarClubes,
    obtenerClubPorPropietario,
    obtenerClubPorId,
    listarIntegrantesClub,
    registrarClub,
    generarCodigoInvitacion,
    modificarClub,
    obtenerClubPorCompetidor,
} from './clubService';

export { registrarCompetidor, modificarCompetidor } from './competidorService';

export {
    listarRobots,
    listarRobotsPorCompetidor,
    registrarRobot,
    eliminarRobot,
    modificarRobot,
} from './robotService';

export {
    listarTorneosPublicos,
    obtenerTorneoPorId,
} from './torneoService';

export {
    listarInscripcionesPorTorneo,
    registrarInscripcion,
} from './inscripcionService';

export { listarEnfrentamientosPorTorneo } from './enfrentamientoService';

export { listarCategorias } from './categoriaService';

// Servicios como objetos (para importar todo el módulo)
export { default as authService } from './authService';
export { default as clubService } from './clubService';
export { default as competidorService } from './competidorService';
export { default as robotService } from './robotService';
export { default as torneoService } from './torneoService';
export { default as inscripcionService } from './inscripcionService';
export { default as enfrentamientoService } from './enfrentamientoService';
export { default as categoriaService } from './categoriaService';

// Instancia de axios configurada (por si necesitas usarla directamente)
export { default as axiosInstance } from './axiosConfig';

