import React from "react";
import "./Paginas.css";
import inscripcionesImg from "../../assets/imagenes/inscripciones.png";

const Informacion = () => {
    return (
        <div className="page-wrapper">
            <section className="page-section">
                <div className="container">
                    {/* Header */}
                    <div className="section-header animate-fadeIn">
                        <span className="section-badge">Información del Concurso</span>
                        <h1 className="section-title">
                            <span className="text-gradient">Innova Robot 2025</span>
                        </h1>
                    </div>

                    {/* Objetivo General */}
                    <div className="content-block objetivo-block animate-fadeIn">
                        <div className="block-icon">🎯</div>
                        <h2>Objetivo General</h2>
                        <p>
                            El Concurso de Robótica <strong>"Innova Robot 2025"</strong> tiene como objetivo general
                            fomentar el aprendizaje integral de la ciencia, la tecnología, la ingeniería y las
                            matemáticas <strong>(STEM)</strong> a través de la construcción, diseño y programación
                            de robots autónomos o controlados.
                        </p>
                        <p>
                            Se busca que los participantes desarrollen <strong>competencias técnicas y habilidades blandas</strong> como
                            la creatividad, el pensamiento crítico, la resolución de problemas y el trabajo
                            colaborativo, mediante el planteamiento de soluciones innovadoras a desafíos reales
                            o simulados.
                        </p>
                        <p>
                            Asimismo, el concurso pretende <strong>inspirar vocaciones científicas y tecnológicas</strong> en
                            los estudiantes, promoviendo el uso responsable de la tecnología y la robótica como
                            herramientas para mejorar la calidad de vida y contribuir al desarrollo sostenible.
                        </p>
                    </div>

                    {/* Objetivos Específicos */}
                    <div className="objetivos-especificos animate-fadeIn">
                        <h2><span className="text-gradient">Objetivos Específicos</span></h2>
                        <div className="objetivos-grid">
                            <div className="objetivo-card">
                                <span className="obj-icon">📚</span>
                                <h4>Habilidades STEM</h4>
                                <p>Promover el desarrollo de habilidades mediante la aplicación práctica de conceptos teóricos</p>
                            </div>
                            <div className="objetivo-card">
                                <span className="obj-icon">💡</span>
                                <h4>Creatividad e Innovación</h4>
                                <p>Incentivar el diseño de soluciones originales y eficientes</p>
                            </div>
                            <div className="objetivo-card">
                                <span className="obj-icon">🤝</span>
                                <h4>Trabajo en Equipo</h4>
                                <p>Impulsar la cooperación, liderazgo y gestión colaborativa</p>
                            </div>
                            <div className="objetivo-card">
                                <span className="obj-icon">🧠</span>
                                <h4>Pensamiento Crítico</h4>
                                <p>Estimular el análisis y toma de decisiones basada en evidencias</p>
                            </div>
                            <div className="objetivo-card">
                                <span className="obj-icon">🎓</span>
                                <h4>Carreras Tecnológicas</h4>
                                <p>Generar un entorno motivador hacia la ingeniería y robótica</p>
                            </div>
                            <div className="objetivo-card">
                                <span className="obj-icon">⚖️</span>
                                <h4>Valores Éticos</h4>
                                <p>Resaltar la importancia del respeto, disciplina y equidad</p>
                            </div>
                        </div>
                    </div>

                    {/* Conducta y Penalizaciones */}
                    <div className="conducta-block animate-fadeIn">
                        <div className="block-icon">⚠️</div>
                        <h2>Conducta y Penalizaciones</h2>
                        <div className="reglas-list">
                            <div className="regla-item warning">
                                <span>🚫</span>
                                <p>Cualquier intento de <strong>sabotaje o interferencia</strong> resultará en descalificación inmediata.</p>
                            </div>
                            <div className="regla-item warning">
                                <span>🗣️</span>
                                <p>El uso de <strong>lenguaje inapropiado o falta de respeto</strong> será motivo de sanción.</p>
                            </div>
                            <div className="regla-item">
                                <span>🔍</span>
                                <p>Los robots serán <strong>revisados antes de competir</strong> para verificar el cumplimiento de las normas.</p>
                            </div>
                        </div>
                    </div>

                    {/* Inscripciones */}
                    <div className="inscripciones-section animate-fadeIn">
                        <div className="inscripciones-card">
                            <div className="inscripciones-image">
                                <img src={inscripcionesImg} alt="Inscripciones" />
                            </div>
                            <div className="inscripciones-content">
                                <h2>📝 Inscripciones</h2>

                                <div className="fechas-grid">
                                    <div className="fecha-item">
                                        <span className="fecha-label">Inicio de Inscripciones</span>
                                        <span className="fecha-value">10 de Noviembre 2025</span>
                                    </div>
                                    <div className="fecha-item">
                                        <span className="fecha-label">Cierre de Inscripciones</span>
                                        <span className="fecha-value">30 de Noviembre 2025</span>
                                    </div>
                                </div>

                                <div className="torneo-fechas">
                                    <h3>🏆 Fechas del Torneo</h3>
                                    <div className="fechas-grid">
                                        <div className="fecha-item highlight">
                                            <span className="fecha-label">Inicio del Torneo</span>
                                            <span className="fecha-value">17 de Diciembre 2025</span>
                                        </div>
                                        <div className="fecha-item highlight">
                                            <span className="fecha-label">Final del Torneo</span>
                                            <span className="fecha-value">20 de Diciembre 2025</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="contacto-info">
                                    <h3>📞 Contacto</h3>
                                    <div className="contacto-grid">
                                        <p><strong>Empresa:</strong> Robotech - Departamento de Robótica</p>
                                        <p><strong>Asesor:</strong> Pillaca Taquire Juan Alberto</p>
                                        <p><strong>Correo:</strong> torneo.robotica@roboteche.com</p>
                                        <p><strong>Celular:</strong> 44962511</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Informacion;
