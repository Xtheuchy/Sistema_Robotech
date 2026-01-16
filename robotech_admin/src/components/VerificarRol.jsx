import { useAuth } from '../context/AuthContext';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Componente para verificar roles específicos en rutas
 * Diferente de RutaProtegida que solo valida autenticación
 */
const VerificarRol = ({ elemento, rolesPermitidos }) => {
    const { usuario } = useAuth();

    // Si no hay roles especificados, permite acceso a todos los usuarios autenticados
    if (!rolesPermitidos || rolesPermitidos.length === 0) {
        return elemento;
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    const tienePermiso = rolesPermitidos.includes(usuario?.rol);

    // Si tiene permiso muestra el componente, si no muestra 404
    return tienePermiso ? elemento : <NotFoundPage />;
};

export default VerificarRol;
