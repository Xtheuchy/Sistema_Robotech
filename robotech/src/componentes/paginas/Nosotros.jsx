import React from "react";
import "./Paginas.css";
import misionImg from "../../assets/imagenes/Misiion.jpg";
import visionImg from "../../assets/imagenes/vision.jpg";

const Nosotros = () => {
    return (
        <div className="page-wrapper">
            <section className="page-section">
                <div className="container">
                    {/* Header */}
                    <div className="section-header animate-fadeIn">
                        <span className="section-badge">Sobre Nosotros</span>
                        <h1 className="section-title">
                            Conoce a <span className="text-gradient">Robotech Perú</span>
                        </h1>
                    </div>

                    {/* Reseña Histórica */}
                    <div className="content-block animate-fadeIn">
                        <div className="block-icon">📜</div>
                        <h2>Reseña Histórica</h2>
                        <p>
                            <strong>Robotech Perú</strong> se fundó en <strong>2018</strong> en el distrito de
                            San Miguel, Lima, con el objetivo de promover la educación tecnológica y el desarrollo
                            de habilidades en robótica entre jóvenes peruanos.
                        </p>
                        <p>
                            Desde su creación, la empresa ha organizado diversos <strong>concursos y hackatones</strong> en
                            instituciones educativas, buscando incentivar la creatividad y el pensamiento crítico
                            en los estudiantes.
                        </p>
                        <p>
                            A través de alianzas con <strong>universidades, empresas tecnológicas y el sector público</strong>,
                            Robotech Perú ha logrado expandir su impacto, llevando la robótica a diversas regiones
                            del país y contribuyendo al fortalecimiento del <strong>ecosistema STEM en el Perú</strong>.
                        </p>
                    </div>

                    {/* Misión y Visión */}
                    <div className="cards-grid">
                        <div className="info-card animate-fadeIn">
                            <div className="card-image">
                                <img src={misionImg} alt="Nuestra Misión" />
                            </div>
                            <div className="card-content">
                                <div className="card-icon">🎯</div>
                                <h3>Misión</h3>
                                <p>
                                    "Organizar y promover concursos de robótica y tecnología educativa que inspiren
                                    a estudiantes de todo el país a desarrollar habilidades en <strong>ciencia, tecnología,
                                        ingeniería y matemáticas (STEM)</strong>, fomentando la innovación y el trabajo en equipo
                                    para enfrentar los desafíos del futuro."
                                </p>
                            </div>
                        </div>

                        <div className="info-card animate-fadeIn">
                            <div className="card-image">
                                <img src={visionImg} alt="Nuestra Visión" />
                            </div>
                            <div className="card-content">
                                <div className="card-icon">🔭</div>
                                <h3>Visión</h3>
                                <p>
                                    "Ser la <strong>plataforma líder en el Perú</strong> para la organización de competencias
                                    de robótica y tecnología educativa, reconocida por su contribución al desarrollo
                                    de talento joven y por su impacto en la <strong>transformación digital del país</strong>."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Valores */}
                    <div className="values-section animate-fadeIn">
                        <h2><span className="text-gradient">Nuestros Valores</span></h2>
                        <div className="values-grid">
                            <div className="value-item">
                                <span className="value-icon">🚀</span>
                                <h4>Innovación</h4>
                                <p>Impulsamos soluciones creativas</p>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">🤝</span>
                                <h4>Trabajo en Equipo</h4>
                                <p>Juntos logramos más</p>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">🎓</span>
                                <h4>Aprendizaje</h4>
                                <p>Educación continua</p>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">⚡</span>
                                <h4>Pasión</h4>
                                <p>Amor por la tecnología</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Nosotros;
