import React from "react";
import { Link } from "react-router-dom";
import "./Paginas.css";
import robotImg from "../../assets/imagenes/robot13.png";

const Inicio = () => {
    return (
        <div className="page-wrapper">
            <section className="hero-section">
                <div className="hero-particles"></div>
                <div className="hero-glow"></div>

                <div className="hero-content">
                    <div className="hero-text">
                        <span className="hero-badge">🤖 Temporada 2025</span>
                        <h1 className="hero-title">
                            Bienvenida al Concurso de Robótica
                            <span className="title-main">
                                <span className="text-gradient">ROBOTECH</span>
                            </span>
                        </h1>

                        <div className="hero-message">
                            <p className="hero-description">
                                ¡Bienvenidos al <strong>Concurso de Robótica</strong> organizado por <strong>Robotech</strong>!
                            </p>
                            <p className="hero-description">
                                Hoy celebramos la creatividad, el ingenio y el trabajo en equipo de jóvenes mentes
                                brillantes que están <strong>construyendo el futuro</strong>, un circuito a la vez.
                            </p>
                            <p className="hero-description">
                                Prepárense para una jornada llena de <strong>innovación, desafíos y mucha tecnología</strong>.
                            </p>
                            <p className="hero-quote">
                                ¡Que comiencen los retos... y que los robots hablen por ustedes! 🚀
                            </p>
                        </div>

                        <div className="hero-buttons">
                            <Link to="/informacion" className="btn-primary">
                                <span>Ver Información</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link to="/registro/competidor" className="btn-secondary">
                                <span>Inscribirse</span>
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Competidores</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">8</span>
                                <span className="stat-label">Categorías</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Clubes</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="image-glow"></div>
                        <img src={robotImg} alt="Robot de competición" />
                        <div className="floating-elements">
                            <div className="float-element el-1">⚡</div>
                            <div className="float-element el-2">🔧</div>
                            <div className="float-element el-3">💡</div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span>Descubre más</span>
                    <div className="scroll-arrow"></div>
                </div>
            </section>
        </div>
    );
};

export default Inicio;
