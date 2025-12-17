import React from "react";
import "./Home.css";

// Imágenes
import robotImg from "../../assets/imagenes/robot13.png";
import misionImg from "../../assets/imagenes/Misiion.jpg";
import visionImg from "../../assets/imagenes/vision.jpg";

const Home = () => {
    return (
        <div className="home-gamer">
            {/* Hero Section */}
            <section className="hero-section" id="inicio">
                <div className="hero-particles"></div>
                <div className="hero-glow"></div>

                <div className="hero-content">
                    <div className="hero-text">
                        <span className="hero-badge">🤖 Temporada 2025</span>
                        <h1 className="hero-title">
                            <span className="title-line">EL TORNEO DE</span>
                            <span className="title-main">
                                <span className="text-gradient">ROBÓTICA</span>
                            </span>
                            <span className="title-line">MÁS ÉPICO</span>
                        </h1>
                        <p className="hero-description">
                            Únete a la competencia donde la innovación, creatividad y
                            tecnología se fusionan en batallas de robots impresionantes.
                        </p>
                        <div className="hero-buttons">
                            <a href="#informacion" className="btn-primary">
                                <span>Ver Categorías</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a href="#nosotros" className="btn-secondary">
                                <span>Conoce Más</span>
                            </a>
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
                    <span>Scroll</span>
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            {/* Nosotros Section */}
            <section className="about-section" id="nosotros">
                <div className="section-header">
                    <span className="section-badge">Sobre Nosotros</span>
                    <h2 className="section-title">
                        Somos <span className="text-gradient">RoboTech</span>
                    </h2>
                    <p className="section-subtitle">
                        Impulsando la próxima generación de innovadores tecnológicos
                    </p>
                </div>

                <div className="about-grid">
                    <div className="about-card">
                        <div className="card-icon">🎯</div>
                        <h3>Misión</h3>
                        <p>
                            Fomentar el desarrollo de habilidades STEM a través de la robótica
                            competitiva, inspirando a jóvenes a convertirse en los innovadores del mañana.
                        </p>
                        <div className="card-image">
                            <img src={misionImg} alt="Nuestra Misión" />
                        </div>
                    </div>

                    <div className="about-card">
                        <div className="card-icon">🔭</div>
                        <h3>Visión</h3>
                        <p>
                            Ser el torneo de robótica líder en la región, reconocido por la excelencia
                            técnica y el espíritu deportivo de nuestros participantes.
                        </p>
                        <div className="card-image">
                            <img src={visionImg} alt="Nuestra Visión" />
                        </div>
                    </div>

                    <div className="about-card values-card">
                        <div className="card-icon">💎</div>
                        <h3>Valores</h3>
                        <ul className="values-list">
                            <li><span className="value-icon">🚀</span> Innovación</li>
                            <li><span className="value-icon">🤝</span> Trabajo en equipo</li>
                            <li><span className="value-icon">🎓</span> Aprendizaje continuo</li>
                            <li><span className="value-icon">⚡</span> Pasión tecnológica</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Información Section */}
            <section className="info-section" id="informacion">
                <div className="section-header">
                    <span className="section-badge">Categorías</span>
                    <h2 className="section-title">
                        Elige tu <span className="text-gradient">Batalla</span>
                    </h2>
                    <p className="section-subtitle">
                        8 categorías épicas esperan por ti y tu robot
                    </p>
                </div>

                <div className="categories-grid">
                    <div className="category-card">
                        <div className="category-icon">🥋</div>
                        <h3>Sumo</h3>
                        <p>Empuja a tu oponente fuera del ring</p>
                        <span className="category-tag">Popular</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🏃</div>
                        <h3>Sumo Extremo</h3>
                        <p>La versión más intensa del sumo clásico</p>
                        <span className="category-tag">Extremo</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🔍</div>
                        <h3>Laberintos</h3>
                        <p>Navega y resuelve el laberinto más rápido</p>
                        <span className="category-tag">Inteligencia</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">⚽</div>
                        <h3>Fútbol</h3>
                        <p>Robots jugando el deporte rey</p>
                        <span className="category-tag">Equipo</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🚁</div>
                        <h3>Drones</h3>
                        <p>Competencias aéreas de precisión</p>
                        <span className="category-tag">Aéreo</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🆘</div>
                        <h3>Rescate</h3>
                        <p>Misiones de salvamento automatizadas</p>
                        <span className="category-tag">Humanitario</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">⚔️</div>
                        <h3>Batalla IA</h3>
                        <p>Combate con inteligencia artificial</p>
                        <span className="category-tag">IA</span>
                    </div>

                    <div className="category-card">
                        <div className="category-icon">🎲</div>
                        <h3>RoboRally</h3>
                        <p>Estrategia y velocidad combinadas</p>
                        <span className="category-tag">Estrategia</span>
                    </div>
                </div>
            </section>

            {/* Ranking Section */}
            <section className="ranking-section" id="ranking">
                <div className="section-header">
                    <span className="section-badge">Clasificación</span>
                    <h2 className="section-title">
                        Top <span className="text-gradient">Ranking</span>
                    </h2>
                    <p className="section-subtitle">
                        Los mejores competidores de la temporada
                    </p>
                </div>

                <div className="ranking-table-container">
                    <table className="ranking-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Competidor</th>
                                <th>Club</th>
                                <th>Puntos</th>
                                <th>Victorias</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="rank-gold">
                                <td><span className="rank-badge">🥇</span></td>
                                <td>RobotMaster_X</td>
                                <td>Tech Warriors</td>
                                <td>2,450</td>
                                <td>28</td>
                            </tr>
                            <tr className="rank-silver">
                                <td><span className="rank-badge">🥈</span></td>
                                <td>CyberBot2000</td>
                                <td>Digital Ninjas</td>
                                <td>2,380</td>
                                <td>25</td>
                            </tr>
                            <tr className="rank-bronze">
                                <td><span className="rank-badge">🥉</span></td>
                                <td>MechaKnight</td>
                                <td>Iron Legion</td>
                                <td>2,250</td>
                                <td>23</td>
                            </tr>
                            <tr>
                                <td><span className="rank-number">4</span></td>
                                <td>NanoBot_Pro</td>
                                <td>Future Builders</td>
                                <td>2,100</td>
                                <td>20</td>
                            </tr>
                            <tr>
                                <td><span className="rank-number">5</span></td>
                                <td>TitaniumForce</td>
                                <td>Metal Storm</td>
                                <td>1,980</td>
                                <td>18</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="ranking-cta">
                    <p>¿Quieres ver tu nombre aquí?</p>
                    <a href="/registro/competidor" className="btn-primary">
                        <span>Regístrate Ahora</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Home;
