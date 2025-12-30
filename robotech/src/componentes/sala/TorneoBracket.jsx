import React, { useState, useEffect, useMemo } from 'react';

/**
 * Componente de visualización del Bracket de un torneo (solo lectura)
 * No permite editar resultados ni generar rondas
 */
const TorneoBracket = ({ matches = [], loading = false, error = null, torneoNombre = "" }) => {

    // Agrupa los partidos por ronda para dibujarlos en columnas
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

    if (loading) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)'
            }}>
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p style={{ marginTop: '1rem' }}>Cargando enfrentamientos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#f87171',
                background: 'rgba(248, 113, 113, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(248, 113, 113, 0.3)'
            }}>
                <p>❌ {error}</p>
            </div>
        );
    }

    if (rondas.length === 0) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚔️</span>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                    Aún no hay enfrentamientos programados para este torneo.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '1.5rem',
            overflowX: 'auto'
        }}>
            {/* Cabecera */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                        ⚔️ Llaves del Torneo
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                        Ronda Actual: <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>{rondaActual}</span>
                    </p>
                </div>
            </div>

            {/* Área visual del bracket */}
            <div style={{
                display: 'flex',
                gap: '3rem',
                paddingBottom: '1rem',
                minWidth: 'max-content'
            }}>
                {rondas.map((matchesRonda, roundIndex) => {
                    const isLastRound = roundIndex === rondas.length - 1;
                    const isFinalMatch = matchesRonda.length === 1;

                    return (
                        <div key={roundIndex} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '280px'
                        }}>
                            {/* Etiqueta de ronda */}
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    border: '1px solid',
                                    ...(isFinalMatch
                                        ? { background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.5)' }
                                        : { background: 'rgba(51, 65, 85, 0.5)', color: '#94a3b8', borderColor: 'rgba(71, 85, 105, 0.5)' })
                                }}>
                                    {isFinalMatch ? '🏆 Gran Final' : `Ronda ${roundIndex + 1}`}
                                </span>
                            </div>

                            {/* Lista de partidos */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                justifyContent: 'space-around',
                                gap: '1.5rem'
                            }}>
                                {matchesRonda.map((match) => (
                                    <MatchCard
                                        key={match.id}
                                        match={match}
                                        hasConnector={!isLastRound}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Componente visual para cada tarjeta de partido
const MatchCard = ({ match, hasConnector }) => {
    const winner = match.apodoGanador;
    const isFinished = Boolean(winner);

    const isC1Winner = isFinished && winner === match.c1_apodo;
    const isC2Winner = isFinished && winner === match.c2_apodo;
    const isC1Loser = isFinished && !isC1Winner;
    const isC2Loser = isFinished && !isC2Winner;

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{
                width: '100%',
                borderRadius: '10px',
                border: `1px solid ${isFinished ? 'rgba(71, 85, 105, 0.5)' : 'rgba(100, 116, 139, 0.5)'}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: isFinished ? 'rgba(30, 41, 59, 0.8)' : 'rgba(51, 65, 85, 0.5)',
                transition: 'all 0.3s ease'
            }}>
                {/* Header del partido */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid rgba(71, 85, 105, 0.5)',
                    minHeight: '32px'
                }}>
                    {isFinished ? (
                        <span style={{
                            fontSize: '0.65rem',
                            color: '#4ade80',
                            fontWeight: 'bold',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            background: 'rgba(74, 222, 128, 0.2)',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '4px'
                        }}>
                            ✅ Finalizado
                        </span>
                    ) : (
                        <span style={{
                            fontSize: '0.65rem',
                            color: '#fbbf24',
                            fontWeight: 'bold',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            background: 'rgba(251, 191, 36, 0.2)',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '4px'
                        }}>
                            ⏳ Pendiente
                        </span>
                    )}
                </div>

                {/* Jugador 1 */}
                <PlayerRow
                    apodo={match.c1_apodo}
                    foto={match.c1_foto}
                    score={match.puntaje1}
                    isWinner={isC1Winner}
                    isLoser={isC1Loser}
                />

                {/* Separador */}
                <div style={{ height: '1px', background: 'rgba(71, 85, 105, 0.5)', width: '100%' }} />

                {/* Jugador 2 */}
                <PlayerRow
                    apodo={match.c2_apodo}
                    foto={match.c2_foto}
                    score={match.puntaje2}
                    isWinner={isC2Winner}
                    isLoser={isC2Loser}
                />
            </div>

            {/* Conector visual a la siguiente ronda */}
            {hasConnector && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    width: '2rem',
                    height: '2px',
                    background: 'rgba(100, 116, 139, 0.5)',
                    transform: 'translateX(100%)',
                    zIndex: 0
                }} />
            )}
        </div>
    );
};

// Fila de jugador
const PlayerRow = ({ apodo, foto, score, isWinner, isLoser }) => {
    const renderScore = () => (score === null || score === undefined ? '-' : score);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            transition: 'all 0.3s ease',
            background: isWinner ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            opacity: isLoser ? 0.4 : 1,
            filter: isLoser ? 'grayscale(100%)' : 'none',
            position: 'relative'
        }}>
            {/* Indicador de ganador */}
            {isWinner && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    height: '60%',
                    width: '3px',
                    background: '#06b6d4',
                    borderRadius: '0 4px 4px 0'
                }} />
            )}

            {/* Info del jugador */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                overflow: 'hidden',
                flex: 1
            }}>
                {/* Foto */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'rgba(71, 85, 105, 0.5)',
                    flexShrink: 0,
                    overflow: 'hidden',
                    border: '1px solid rgba(100, 116, 139, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {foto ? (
                        <img src={foto} alt={apodo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>?</span>
                    )}
                </div>

                {/* Nombre */}
                <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isWinner ? '#06b6d4' : 'rgba(255,255,255,0.8)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {apodo || 'Esperando...'}
                </span>
            </div>

            {/* Puntaje */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                    width: '32px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    border: '1px solid',
                    ...(isWinner
                        ? { background: 'rgba(6, 182, 212, 0.2)', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#06b6d4' }
                        : { background: 'rgba(71, 85, 105, 0.5)', borderColor: 'rgba(100, 116, 139, 0.5)', color: 'rgba(255,255,255,0.8)' })
                }}>
                    {renderScore()}
                </div>
                {isWinner && <span style={{ fontSize: '0.9rem' }}>🏆</span>}
            </div>
        </div>
    );
};

export default TorneoBracket;
