import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerTorneoPorId, listarRobotsPorCompetidor, listarEnfrentamientosPorTorneo, listarInscripcionesPorTorneo, registrarInscripcion } from "../../api";
import TorneoBracket from "./TorneoBracket";
import "./Sala.css";

// Imagen por defecto
import imagenDefault from "../../assets/imagenes/sumo1.jpeg";
import videoFondo from "../../assets/video/video2.mp4";

const SalaTorneo = () => {
    const { id } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Vista actual: 'info' | 'bracket' | 'inscripcion'
    const [vistaActual, setVistaActual] = useState('info');

    // Estados para enfrentamientos
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [errorMatches, setErrorMatches] = useState(null);

    // Estados para inscripción
    const [competidor, setCompetidor] = useState(null);
    const [robots, setRobots] = useState([]);
    const [inscrito, setInscrito] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [loadingInscripcion, setLoadingInscripcion] = useState(false);
    const [inscripcionesCount, setInscripcionesCount] = useState(0);

    // Cargar datos del torneo desde API

    useEffect(() => {
        const cargarTorneo = async () => {
            try {
                setLoading(true);
                const data = await obtenerTorneoPorId(id);
                setTorneo(data);
                setError(null);
            } catch (err) {
                console.error("Error cargando torneo:", err);
                setError("No se pudo cargar el torneo");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            cargarTorneo();
        }
    }, [id]);

    // Cargar inscripciones y verificar si el competidor ya está inscrito
    useEffect(() => {
        const cargarInscripciones = async () => {
            if (!id) return;
            try {
                const data = await listarInscripcionesPorTorneo(id);
                const lista = Array.isArray(data) ? data : [];
                setInscripcionesCount(lista.length);

                // Si hay un competidor logueado, verificar si está en la lista
                if (competidor) {
                    const estaInscrito = lista.some(ins => {
                        const userId = competidor.id;
                        const userEmail = competidor.correo;

                        // Verificar si el competidor ya está inscrito por ID o correo
                        const matchId = (ins.competidor?.id == userId) || (ins.competidorId == userId);
                        const matchEmail = (userEmail && ins.correo === userEmail);

                        return matchId || matchEmail;
                    });

                    if (estaInscrito) {
                        setInscrito(true);
                        setMensaje("✅ ¡Ya estás participando en este torneo!");
                    }
                }
            } catch (err) {
                console.error("Error cargando inscripciones:", err);
                setInscripcionesCount(0);
            }
        };

        cargarInscripciones();
    }, [id, competidor]);

    // Cargar enfrentamientos cuando se cambia a la vista de bracket
    useEffect(() => {
        const cargarEnfrentamientos = async () => {
            if (vistaActual !== 'bracket' || !id) return;

            try {
                setLoadingMatches(true);
                const data = await listarEnfrentamientosPorTorneo(id);
                console.log("Enfrentamientos cargados:", data);
                setMatches(data || []);
                setErrorMatches(null);
            } catch (err) {
                console.error("Error cargando enfrentamientos:", err);
                setErrorMatches("No se pudieron cargar los enfrentamientos");
            } finally {
                setLoadingMatches(false);
            }
        };

        cargarEnfrentamientos();
    }, [vistaActual, id]);

    // Cargar datos del competidor
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("UsuarioData"));
        const club = JSON.parse(localStorage.getItem("clubActivo"));
        setCompetidor(user);
        if (user) {
            cargarRobots(user.id);
        }
    }, []);

    // Verificar si es competidor (no dueño de club)
    const esCompetidor = competidor && !JSON.parse(localStorage.getItem("clubActivo"));

    // Verificar si el torneo está lleno
    const maxParticipantes = torneo?.cantidadParticipantes || 8;
    const torneoLleno = inscripcionesCount >= maxParticipantes;

    const cargarRobots = async (competidorId) => {
        try {
            const data = await listarRobotsPorCompetidor(competidorId);
            setRobots(data || []);
        } catch (error) {
            console.error("Error cargando robots:", error);
        }
    };

    const handleInscribir = async () => {
        if (!competidor) {
            setMensaje("⚠ Inicia sesión como competidor para inscribirte.");
            return;
        }

        // Validación local rápida
        if (robots.length === 0) {
            setMensaje("⛔ No tienes robots. Crea uno en tu perfil antes de inscribirte.");
            return;
        }

        if (!window.confirm("⚠️ ADVERTENCIA: Una vez inscrito, NO podrás cancelar tu inscripción.\n\n¿Estás seguro de que deseas participar en este torneo?")) {
            return;
        }

        setLoadingInscripcion(true);
        setMensaje("");

        try {
            await registrarInscripcion({
                torneoId: parseInt(id),
                competidorId: competidor.id
            });
            setInscrito(true);
            setMensaje("✅ ¡Inscripción exitosa! Tu Inscripción ha sido registrado.");
        } catch (err) {
            const errorMsg = err.response?.data || "Error al realizar la inscripción";
            setMensaje(`❌ ${typeof errorMsg === 'string' ? errorMsg : 'No cumples con los requisitos para este torneo'}`);
        } finally {
            setLoadingInscripcion(false);
        }
    };

    if (loading) {
        return (
            <div className="sala-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-white">Cargando torneo...</p>
                </div>
            </div>
        );
    }

    if (error || !torneo) {
        return (
            <div className="sala-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="text-center text-white">
                    <h2>❌ Torneo no encontrado</h2>
                    <p>{error || "El torneo solicitado no existe"}</p>
                    <Link to="/torneos" className="btn btn-outline-info mt-3">← Volver a Torneos</Link>
                </div>
            </div>
        );
    }

    // Campos del TorneoDTO
    const nombre = torneo.nombreTorneo || "Torneo";
    const descripcion = torneo.descripcionTorneo || "Sin descripción";
    const imagen = torneo.fotoTorneo || imagenDefault;
    const categoria = torneo.nombreCategoria || "";
    const descCategoria = torneo.descripcionCategoria || "";
    const sede = torneo.nombreSede || "";
    const direccionSede = torneo.direccionSede || "";
    const juez = torneo.nombreJuez || "";
    const correoJuez = torneo.correoJuez || "";
    const fechaInicio = torneo.fechaInicio || "";
    const fechaFinal = torneo.fechaFinal || "";
    const estado = torneo.estado || "";
    const cantidadParticipantes = torneo.cantidadParticipantes || 0;

    return (
        <div className="sala-page">
            <div className="video-background-layer">
                <video className="bg-video" autoPlay muted loop playsInline>
                    <source src={videoFondo} type="video/mp4" />
                </video>
                <div className="bg-overlay"></div>
            </div>

            <div className="sala-container-split">
                <header className="sala-header">
                    <div className="header-title">
                        <span>🏆</span>
                        <h1>{nombre}</h1>
                    </div>
                    <Link to="/torneos" className="btn-back-nav">◀ VOLVER</Link>
                </header>

                {/* Navegación de pestañas */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => setVistaActual('info')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            ...(vistaActual === 'info'
                                ? { background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)', color: 'white' }
                                : { background: 'rgba(51, 65, 85, 0.5)', color: 'rgba(255,255,255,0.7)' })
                        }}
                    >
                        📋 Información
                    </button>
                    <button
                        onClick={() => setVistaActual('bracket')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            ...(vistaActual === 'bracket'
                                ? { background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)', color: 'white' }
                                : { background: 'rgba(51, 65, 85, 0.5)', color: 'rgba(255,255,255,0.7)' })
                        }}
                    >
                        ⚔️ Ver Enfrentamientos
                    </button>
                    {/* Solo mostrar inscripción para competidores y si hay cupos disponibles */}
                    {esCompetidor && !torneoLleno && (
                        <button
                            onClick={() => setVistaActual('inscripcion')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                ...(vistaActual === 'inscripcion'
                                    ? { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }
                                    : { background: 'rgba(51, 65, 85, 0.5)', color: 'rgba(255,255,255,0.7)' })
                            }}
                        >
                            ✍️ Inscribirse
                        </button>
                    )}
                </div>

                {/* Vista: Información */}
                {vistaActual === 'info' && (
                    <div className="split-top-section">
                        <div className="image-col">
                            <img
                                src={imagen}
                                alt={nombre}
                                className="medium-image"
                                onError={e => e.target.src = imagenDefault}
                            />
                        </div>
                        <div className="desc-col">
                            <h2>Detalles del Evento</h2>
                            <div className="desc-text">
                                {descripcion}

                                {categoria && (
                                    <div className="mt-3" style={{ color: '#fbbf24' }}>
                                        <strong>🤖 Categoría:</strong> {categoria}
                                        {descCategoria && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}> - {descCategoria}</span>}
                                    </div>
                                )}

                                {sede && (
                                    <div className="mt-2" style={{ color: '#06b6d4' }}>
                                        <strong>📍 Sede:</strong> {sede}
                                        {direccionSede && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}> ({direccionSede})</span>}
                                    </div>
                                )}

                                {juez && (
                                    <div className="mt-2" style={{ color: '#a78bfa' }}>
                                        <strong>👨‍⚖️ Juez:</strong> {juez}
                                        {correoJuez && <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}> ({correoJuez})</span>}
                                    </div>
                                )}
                            </div>
                            <div className="stats-row">
                                {fechaInicio && <span className="stat-badge">📅 Inicio: {fechaInicio}</span>}
                                {fechaFinal && <span className="stat-badge">🏁 Fin: {fechaFinal}</span>}
                                <span className="stat-badge">👥 {cantidadParticipantes} Participantes</span>
                                {estado && <span className="stat-badge" style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>⚡ {estado}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Vista: Bracket de Enfrentamientos */}
                {vistaActual === 'bracket' && (
                    <TorneoBracket
                        matches={matches}
                        loading={loadingMatches}
                        error={errorMatches}
                        torneoNombre={nombre}
                    />
                )}

                {/* Vista: Inscripción - Solo para competidores y si hay cupos */}
                {vistaActual === 'inscripcion' && esCompetidor && !torneoLleno && (
                    <div className="inscription-section" style={{
                        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                        borderRadius: '16px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '2rem'
                    }}>
                        <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>🚀 ¡Participa en el Torneo!</h3>

                        {mensaje && (
                            <div
                                style={{
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    marginBottom: '1rem',
                                    color: mensaje.includes('✅') ? '#4ade80' : '#fbbf24',
                                    background: mensaje.includes('✅') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                    border: `1px solid ${mensaje.includes('✅') ? 'rgba(74, 222, 128, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                                }}
                            >
                                {mensaje}
                            </div>
                        )}

                        {inscrito ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4ade80', fontWeight: 'bold' }}>
                                    ✅ ¡INSCRITO!
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                                    Tu inscripción está registrado para este torneo.
                                </p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                                    Inscribe tu robot para participar en este torneo.
                                    {categoria && (
                                        <span style={{ display: 'block', marginTop: '0.5rem', color: '#fbbf24' }}>
                                            Solo robots de categoría: <strong>{categoria}</strong>
                                        </span>
                                    )}
                                </p>
                                <button
                                    onClick={handleInscribir}
                                    disabled={loadingInscripcion}
                                    style={{
                                        background: loadingInscripcion ? '#64748b' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '14px 32px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        cursor: loadingInscripcion ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                        opacity: loadingInscripcion ? 0.7 : 1
                                    }}
                                >
                                    {loadingInscripcion ? "⏳ Procesando..." : "✍️ INSCRIBIRME"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default SalaTorneo;
