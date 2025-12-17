// ===== API Service para RoboTech =====
// CONFIGURACIÓN: Poner en 'true' para probar la web sin backend (Modo Demo)
// Poner en 'false' para conectar con el servidor Java real
const USE_MOCK = true;

// URL API de Autenticación y Registro
const AUTH_URL = "/auth";
const REG_URL = "/registro";
const COMPETIDOR_URL = "/competidor";
const CLUB_URL = "/club";
const ROBOTS_URL = "/robots";
const TORNEOS_URL = "/torneos";

// ==========================================
// LÓGICA MOCK (Simulación Local)
// ==========================================
const getMockBD = () => JSON.parse(localStorage.getItem("mock_db_usuarios")) || [];
const saveMockBD = (users) => localStorage.setItem("mock_db_usuarios", JSON.stringify(users));

const mockRegistro = async (datos, tipo) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usuarios = getMockBD();
            if (usuarios.find(u => u.correo === (datos.correo || datos.responsableCorreo))) {
                reject(new Error("Este correo ya está registrado (Mock)"));
                return;
            }
            const nuevoUsuario = {
                id: Date.now(),
                tipo: tipo,
                ...datos,
                password: datos.password || datos.responsableContrasena
            };
            delete nuevoUsuario.confirmarContrasena;
            delete nuevoUsuario.responsableContrasena;
            delete nuevoUsuario.contrasena;

            usuarios.push(nuevoUsuario);
            saveMockBD(usuarios);
            resolve(nuevoUsuario);
        }, 1000);
    });
};

const mockLogin = async (creds, tipoEsperado) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usuarios = getMockBD();
            const usuario = usuarios.find(u => u.correo === creds.correo || u.responsableCorreo === creds.correo);
            if (!usuario) {
                reject(new Error("Usuario no encontrado (Mock)"));
                return;
            }
            if (usuario.password !== creds.password) {
                reject(new Error("Contraseña incorrecta (Mock)"));
                return;
            }
            resolve(usuario);
        }, 800);
    });
};

const getMockRobots = () => JSON.parse(localStorage.getItem("mock_db_robots")) || [];
const saveMockRobots = (robots) => localStorage.setItem("mock_db_robots", JSON.stringify(robots));

const mockCreateRobot = async (robotData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const robots = getMockRobots();
            const newRobot = {
                id: Date.now().toString(),
                ...robotData,
                estado: robotData.estado || "activo"
            };
            robots.push(newRobot);
            saveMockRobots(robots);
            resolve(newRobot);
        }, 500);
    });
};

const mockGetRobots = async (competidorId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const robots = getMockRobots();
            // Filtrar solo los robots de este competidor
            const misRobots = robots.filter(r => r.competidorId == competidorId); // == por si es string/number
            resolve(misRobots);
        }, 500);
    });
};

const mockDeleteRobot = async (robotId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const robots = getMockRobots();
            const newRobots = robots.filter(r => r.id !== robotId);
            saveMockRobots(newRobots);
            resolve(true);
        }, 500);
    });
};

const mockUpdateCompetidor = async (competidorData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const usuarios = getMockBD();
            const index = usuarios.findIndex(u => u.id === competidorData.id || u.correo === competidorData.correo);
            if (index !== -1) {
                usuarios[index] = { ...usuarios[index], ...competidorData };
                saveMockBD(usuarios);
            }
            resolve(competidorData);
        }, 500);
    });
};

const mockInscribir = async (datos) => {
    return new Promise((resolve) => setTimeout(() => resolve({ mensaje: "Inscripción Exitosa (Mock)" }), 500));
};

const mockGetParticipantes = async (torneoId) => {
    return new Promise((resolve) => setTimeout(() => resolve([]), 500));
};

// ==========================================
// FUNCIONES EXPORTADAS (Fachada)
// ==========================================

// ===== Login =====
export const login = async (credencialesDTO) => {
    if (USE_MOCK) return mockLogin(credencialesDTO, "cualquiera");

    const response = await fetch(`${AUTH_URL}/login/cliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credencialesDTO),
    });

    if (!response.ok) {
        const errorTexto = await response.text();
        throw new Error(errorTexto || "Error de autenticación");
    }
    return await response.json();
};

export const loginCompetidor = async (credencialesDTO) => {
    return await login(credencialesDTO);
};

export const loginClub = async (credencialesDTO) => {
    return await login(credencialesDTO);
};

// ===== Registro =====
export const registroCompetidor = async (datos) => {
    if (USE_MOCK) return mockRegistro(datos, "competidor");

    const response = await fetch(`${REG_URL}/competidor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });

    if (!response.ok) {
        const errorTexto = await response.text();
        throw new Error(errorTexto || "Error en el registro");
    }
    return await response.json();
};

export const registroClub = async (datos) => {
    if (USE_MOCK) return mockRegistro(datos, "club");

    const response = await fetch(`${REG_URL}/club`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });

    if (!response.ok) {
        const errorTexto = await response.text();
        throw new Error(errorTexto || "Error en el registro");
    }
    return await response.json();
};

// ===== Miembros y Datos =====
export const getMiembrosClub = async (clubId) => {
    if (USE_MOCK) {
        return [
            { id: 1, nombre: "Juan Pérez", apodo: "RobotMaster_X", estado: "Activo" },
            { id: 2, nombre: "María García", apodo: "CyberBot2000", estado: "Activo" }
        ];
    }

    // Fetch real: Endpoint /club/{id}/miembros
    const response = await fetch(`${CLUB_URL}/${clubId}/miembros`);
    if (!response.ok) throw new Error("Error al obtener miembros");
    return await response.json();
};

export const getRobots = async (competidorId) => {
    if (USE_MOCK) return mockGetRobots(competidorId);

    const response = await fetch(`${COMPETIDOR_URL}/${competidorId}/robots`);
    if (!response.ok) throw new Error("Error al obtener robots");
    return await response.json();
};

export const createRobot = async (robotData) => {
    if (USE_MOCK) return mockCreateRobot(robotData);

    const response = await fetch(`${ROBOTS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(robotData),
    });
    if (!response.ok) throw new Error("Error al crear robot");
    return await response.json();
};

export const deleteRobot = async (robotId) => {
    if (USE_MOCK) return mockDeleteRobot(robotId);

    const response = await fetch(`${ROBOTS_URL}/${robotId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar robot");
    return true;
};

export const updateCompetidor = async (competidorData) => {
    if (USE_MOCK) return mockUpdateCompetidor(competidorData);

    const response = await fetch(`${COMPETIDOR_URL}/${competidorData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competidorData),
    });
    if (!response.ok) throw new Error("Error al actualizar perfil");
    return await response.json();
};

// ===== Torneos e Inscripciones =====

export const inscribirTorneo = async (inscripcionData) => {
    if (USE_MOCK) return mockInscribir(inscripcionData);

    // Fetch real: POST /torneos/inscribir
    const response = await fetch(`${TORNEOS_URL}/inscribir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inscripcionData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al inscribir");
    }
    return await response.json();
};

export const getParticipantes = async (torneoId) => {
    if (USE_MOCK) return mockGetParticipantes(torneoId);

    // Fetch real: GET /torneos/{id}/participantes
    const response = await fetch(`${TORNEOS_URL}/${torneoId}/participantes`);
    if (!response.ok) return [];
    return await response.json();
};

export const retirarTorneo = async (inscripcionId) => {
    if (USE_MOCK) return true;

    // Fetch real: DELETE /torneos/inscripcion/{id}
    const response = await fetch(`${TORNEOS_URL}/inscripcion/${inscripcionId}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Error al retirar inscripción");
    return true;
};

// ===== Utilidades =====
export const generarCodigoClub = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'RT-';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
};
