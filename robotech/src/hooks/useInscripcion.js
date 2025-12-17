import { useState, useEffect } from 'react';
import { inscribirTorneo, getParticipantes, retirarTorneo } from "../componentes/service/apiService";

export const useInscripcion = (torneoId, categoriaRequerida) => {
    const [inscrito, setInscrito] = useState(false);
    const [robotInscrito, setRobotInscrito] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [competidoresReales, setCompetidoresReales] = useState([]);
    const [inscripcionId, setInscripcionId] = useState(null);

    // Cargar competidores desde API
    const actualizarCompetidores = async () => {
        try {
            const lista = await getParticipantes(torneoId);
            setCompetidoresReales(lista);
            return lista;
        } catch (error) {
            console.error("Error al cargar participantes", error);
        }
    };

    // Verificar inscripción inicial
    useEffect(() => {
        const checkStatus = async () => {
            const user = JSON.parse(localStorage.getItem("UsuarioData"));
            const participantes = await actualizarCompetidores();

            if (user && participantes) {
                // Verificar si el usuario ya está en la lista del backend
                // Asumimos que el backend retorna objetos con { usuarioId, id (inscripcion), ... }
                const miInscripcion = participantes.find(p => p.usuarioId === user.id || p.userId === user.id);
                if (miInscripcion) {
                    setInscrito(true);
                    setRobotInscrito(miInscripcion); // o buscar el robot
                    setInscripcionId(miInscripcion.id); // ID de la inscripción para borrar luego
                }
            }
        };
        checkStatus();
    }, [torneoId]);

    const inscribir = async (robot, usuario) => {
        // Validacion Categoría Normalizada
        const catRobot = robot.categoria.toLowerCase().trim();
        const catTorneo = categoriaRequerida.toLowerCase().trim();

        if (catRobot !== catTorneo) {
            setMensaje(`❌ Error: Tu robot es categoría "${robot.categoria}" y este torneo requiere "${categoriaRequerida}".`);
            return false;
        }

        try {
            const data = {
                torneoId: torneoId,
                competidorId: usuario.id,
                robotId: robot.id
            };

            const response = await inscribirTorneo(data); // Backend call

            setInscrito(true);
            setRobotInscrito(robot);
            setInscripcionId(response.id); // Guardar ID de inscripción retornado
            setMensaje("✅ ¡Inscripción exitosa! Tu robot está en competencia.");
            actualizarCompetidores();
            return true;

        } catch (error) {
            setMensaje(`⚠️ Error al inscribir: ${error.message}`);
            return false;
        }
    };

    const retirar = async (usuarioId) => {
        try {
            const idParaBorrar = inscripcionId || usuarioId;

            await retirarTorneo(idParaBorrar);

            setInscrito(false);
            setRobotInscrito(null);
            setMensaje("⚠️ Te has retirado de la competencia.");
            actualizarCompetidores();
        } catch (error) {
            setMensaje("Error al retirar inscripción.");
        }
    };

    return {
        inscrito,
        robotInscrito,
        mensaje,
        setMensaje,
        inscribir,
        retirar,
        competidoresReales
    };
};
