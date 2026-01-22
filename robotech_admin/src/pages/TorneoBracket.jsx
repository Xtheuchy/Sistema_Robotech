import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { enfrentamientoServicio } from '../service/enfrentamientoService';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const TorneoBracketAdmin = () => {
    //Obtener al usuario que inicio sesion 
    const { usuario } = useAuth();

    // obtengo el id del torneo de la url
    const { torneoId } = useParams();

    // estados para manejar la data y la carga
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    // estados para manejar el modal de edicion
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [enfrentamientoDTO, setEnfrentamientoDTO] = useState({ puntaje1: 0, puntaje2: 0 });
    const [saving, setSaving] = useState(false);

    // carga los datos del bracket desde el backend
    const fetchBracketData = async () => {
        if (!torneoId) return;
        try {
            const data = await enfrentamientoServicio.listarEnfrentamientoPorTorneo(torneoId);
            setMatches(data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar datos del torneo.");
        } finally {
            setLoading(false);
        }
    };

    // ejecuta la carga al montar el componente
    useEffect(() => {
        setLoading(true);
        fetchBracketData();
    }, [torneoId]);

    // agrupa los partidos por ronda para poder dibujarlos en columnas
    const rondas = useMemo(() => {
        if (!matches || matches.length === 0) return [];
        const roundsMap = {};
        matches.forEach((match) => {
            if (!roundsMap[match.ronda]) roundsMap[match.ronda] = [];
            roundsMap[match.ronda].push(match);
        });
        return Object.keys(roundsMap)
            .sort((a, b) => Number(a) - Number(b))
            .map((key) => roundsMap[key]);
    }, [matches]);

    const rondaActual = rondas.length;

    // logica para generar la siguiente ronda automaticamente
    const handleGenerarRonda = async () => {
        if (rondaActual === 0) {
            return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No hay enfrentamientos activos",
            });
        }
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Generar la siguiente ronda a partir de la Ronda ${rondaActual}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, generar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return;
        }
        try {
            setGenerating(true);
            await enfrentamientoServicio.generarSiguienteRonda(torneoId, rondaActual);
            await fetchBracketData();
            return Swal.fire({
                icon: "success",
                title: "Generado",
                text: `¡Ronda ${rondaActual + 1} generada con éxito!`,
            });
        } catch (err) {
            return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            });
        } finally {
            setGenerating(false);
        }
    };

    // abre el modal con la info del partido seleccionado
    const handleOpenEdit = (match) => {
        setSelectedMatch(match);
        setEnfrentamientoDTO({
            puntaje1: match.puntaje1 || 0,
            puntaje2: match.puntaje2 || 0
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEnfrentamientoDTO(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    // guarda el resultado del partido y actualiza el bracket
    const handleSaveResult = async (e) => {
        e.preventDefault();
        if (!selectedMatch) return;
        try {
            setSaving(true);
            await enfrentamientoServicio.registrarResultado(selectedMatch.id, enfrentamientoDTO);
            handleCloseModal();
            await fetchBracketData();
        } catch (err) {
            return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse">Cargando Bracket...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-medium">{error}</div>;

    return (
        <main className="w-full bg-slate-900 p-6 min-h-[600px] rounded-xl border border-slate-800 shadow-sm overflow-x-auto relative">

            {/* navegacion superior */}
            <nav>
                <Link to={`/DetalleTorneo/${torneoId}`} className="bg-slate-800 p-2 rounded text-xs text-slate-400 border border-slate-700 hover:text-white transition-colors inline-block mb-4">
                    <i className="fa-solid fa-arrow-left mr-1"></i> Volver
                </Link>
            </nav>

            {/* cabecera con titulo y acciones */}
            <header className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4 gap-4 flex-wrap">
                <div>
                    <h2 className="text-xl font-bold text-white">Gestión de Torneo</h2>
                    <p className="text-sm text-slate-400">Torneo #{torneoId} <span className="mx-2">•</span> Ronda Actual: <span className="text-blue-400 font-bold">{rondaActual}</span></p>
                </div>
                {
                    usuario.rol?.toUpperCase() === "JUEZ" && <button
                        onClick={handleGenerarRonda}
                        disabled={generating}
                        className={`bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 cursor-pointer ${generating ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/50 hover:-translate-y-0.5'}`}
                    >
                        {generating ? 'Procesando...' : <><span className="mr-2">⚡</span> Generar Siguiente Ronda</>}
                    </button>
                }
            </header>

            {/* area visual del bracket */}
            <section className="flex flex-row gap-12 pb-4 min-w-max">
                {rondas.map((matchesRonda, roundIndex) => {
                    const isLastRound = roundIndex === rondas.length - 1;
                    const isFinalMatch = matchesRonda.length === 1;

                    return (
                        <div key={roundIndex} className="flex flex-col min-w-[300px]">
                            <div className="text-center mb-6">
                                <span className={`
                                    text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border 
                                    ${isFinalMatch
                                        ? 'bg-amber-900/30 text-amber-500 border-amber-700/50'
                                        : 'bg-slate-800 text-slate-300 border-slate-700'} 
                                `}>
                                    {isFinalMatch ? '🏆 Gran Final' : `Ronda ${roundIndex + 1}`}
                                </span>
                            </div>

                            {/* lista de partidos de la ronda */}
                            <div className="flex flex-col grow justify-around gap-6">
                                {matchesRonda.map((match) => (
                                    <AdminMatchCard
                                        key={match.id}
                                        match={match}
                                        hasConnector={!isLastRound}
                                        onEdit={() => handleOpenEdit(match)}
                                        usuario={usuario}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* modal para ingresar resultados */}
            {isModalOpen && selectedMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <article className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <header className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Registrar Resultado</h3>
                            <button onClick={handleCloseModal} className="text-slate-400 cursor-pointer hover:text-white">✕</button>
                        </header>

                        <form onSubmit={handleSaveResult} className="p-6">
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div className="text-center flex-1">
                                    <span className="block text-slate-300 text-sm font-medium mb-2 truncate">{selectedMatch.c1_apodo || "Jugador 1"}</span>
                                    <input type="number" name="puntaje1" value={enfrentamientoDTO.puntaje1} onChange={handleInputChange} min="0" className="w-20 text-center bg-slate-900 border border-slate-600 rounded text-white py-2 focus:ring-2 focus:ring-blue-500 outline-none text-xl font-mono" />
                                </div>
                                <div className="text-slate-500 font-bold text-xl mt-6">VS</div>
                                <div className="text-center flex-1">
                                    <span className="block text-slate-300 text-sm font-medium mb-2 truncate">{selectedMatch.c2_apodo || "Jugador 2"}</span>
                                    <input type="number" name="puntaje2" value={enfrentamientoDTO.puntaje2} onChange={handleInputChange} min="0" className="w-20 text-center bg-slate-900 border border-slate-600 rounded text-white py-2 focus:ring-2 focus:ring-blue-500 outline-none text-xl font-mono" />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 cursor-pointer rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium">Cancelar</button>
                                <button type="submit" disabled={saving} className="px-6 py-2 rounded cursor-pointer bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">{saving ? 'Guardando...' : 'Confirmar Resultado'}</button>
                            </div>
                        </form>
                    </article>
                </div>
            )}
        </main>
    );
};

// componente visual para cada tarjeta de partido
const AdminMatchCard = ({ match, hasConnector, onEdit, usuario }) => {
    const winner = match.apodoGanador;

    // determina si el partido ya tiene un ganador
    const isFinished = Boolean(winner);

    const isC1Winner = isFinished && winner === match.c1_apodo;
    const isC2Winner = isFinished && winner === match.c2_apodo;
    const isC1Loser = isFinished && !isC1Winner;
    const isC2Loser = isFinished && !isC2Winner;

    return (
        <article className="relative flex items-center">
            <div className={`
                w-full rounded-lg border shadow-lg overflow-hidden flex flex-col relative transition-colors
                ${isFinished ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}
            `}>
                <div className="flex justify-between items-center bg-slate-900/50 px-3 py-2 border-b border-slate-700/50 min-h-10">

                    {/* muestra el boton de ingreso solo si no ha finalizado */}
                    {!isFinished && usuario.rol?.toUpperCase() === "JUEZ" && (
                        <button
                            onClick={onEdit}
                            className="cursor-pointer text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition-colors font-medium shadow-sm animate-pulse-slow"
                        >
                            Ingresar puntaje
                        </button>
                    )}

                    {/* etiqueta visual si esta finalizado */}
                    {isFinished && (
                        <span className="text-[10px] text-sky-500 font-bold border border-emerald-900/50 bg-emerald-900/20 px-2 py-0.5 rounded">
                            Finalizado
                        </span>
                    )}
                </div>
                <PlayerRow apodo={match.c1_apodo} foto={match.c1_foto} score={match.puntaje1} isWinner={isC1Winner} isLoser={isC1Loser} />
                <div className="h-px bg-slate-700 w-full"></div>
                <PlayerRow apodo={match.c2_apodo} foto={match.c2_foto} score={match.puntaje2} isWinner={isC2Winner} isLoser={isC2Loser} />
            </div>
            {hasConnector && <div className="absolute right-0 top-1/2 w-8 h-0.5 bg-slate-600 translate-x-full z-0"></div>}
        </article>
    );
};

const PlayerRow = ({ apodo, foto, score, isWinner, isLoser }) => {
    const renderScore = () => (score === null || score === undefined ? '-' : score);
    return (
        <div className={`flex justify-between items-center px-3 py-3 transition-all duration-300 ${isWinner ? 'bg-sky-900/20' : ''} ${isLoser ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden flex-1">
                {isWinner && <div className="absolute left-0 h-8 w-1 bg-sky-500 rounded-r"></div>}
                <div className="w-8 h-8 rounded bg-slate-700 shrink-0 overflow-hidden border border-slate-600 relative">
                    {foto ? <img src={foto} alt={apodo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">?</div>}
                </div>
                <span className={`text-sm truncate font-medium ${isWinner ? 'text-sky-400' : 'text-slate-300'}`}>{apodo || 'Esperando...'}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-6 flex items-center justify-center rounded font-mono font-bold text-sm border ${isWinner ? 'bg-sky-900/40 border-emerald-500/30 text-sky-400' : 'bg-slate-700/50 border-slate-600 text-slate-300'}`}>{renderScore()}</div>
                {isWinner && <span className="text-emerald-500 text-sm">🏆</span>}
            </div>
        </div>
    );
};

export default TorneoBracketAdmin;