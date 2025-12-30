import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarCompetidor } from "../../api";
import "./Registro.css";
import robotImg from "../../assets/imagenes/robot13.png";

const RegistroCompetidor = () => {
    const [formData, setFormData] = useState({
        nombres: "",
        apodo: "",
        dni: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
        foto: "",
        codigoUnico: "", // OBLIGATORIO - código de invitación del club
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const validateForm = () => {
        if (!formData.codigoUnico.trim()) return "El código de invitación del club es obligatorio";
        if (!formData.nombres.trim()) return "El nombre completo es requerido";
        if (!formData.apodo.trim()) return "El apodo es requerido";
        if (!formData.dni.trim()) return "El DNI es requerido";
        if (formData.dni.length !== 8) return "El DNI debe tener 8 dígitos";
        if (!formData.correo.trim()) return "El correo es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) return "Correo inválido";
        if (!formData.contrasena || formData.contrasena.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        if (formData.contrasena !== formData.confirmarContrasena) return "Las contraseñas no coinciden";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            // Estructura según RegistroCompetidorDTO del backend
            const dataToSend = {
                apodo: formData.apodo,
                codigoUnico: formData.codigoUnico,
                nombres: formData.nombres,
                correo: formData.correo,
                dni: formData.dni,
                foto: formData.foto || "",
                password: formData.contrasena,
            };

            await registrarCompetidor(dataToSend);
            setSuccess("¡Registro exitoso! Redirigiendo al login...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data || err.message;
            if (typeof errorMsg === 'string') {
                if (errorMsg.includes("apodo ya está en uso")) {
                    setError("El apodo ya está en uso, elige otro.");
                } else if (errorMsg.includes("ya está registrado") || errorMsg.includes("existe")) {
                    setError("Este correo o DNI ya está registrado.");
                } else if (errorMsg.includes("código único")) {
                    setError("El código de invitación es inválido o ya fue usado.");
                } else if (errorMsg.includes("club está inactivo")) {
                    setError("El club asociado a este código está inactivo.");
                } else {
                    setError(errorMsg);
                }
            } else {
                setError("Error al registrar. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper registro-page">
            <div className="registro-container">
                {/* Lado izquierdo - Imagen del robot */}
                <div className="registro-image">
                    <div className="image-content">
                        <img src={robotImg} alt="Robot Robotech" className="robot-img" />
                        <div className="image-text">
                            <h2>¡Únete a la <span className="text-gradient">Competencia!</span></h2>
                            <p>Regístrate y demuestra tu talento en robótica</p>
                        </div>
                    </div>
                    <div className="image-glow"></div>
                </div>

                {/* Lado derecho - Formulario */}
                <div className="registro-form-container">
                    <div className="form-header">
                        <span className="form-icon">🤖</span>
                        <h2>Registro Competidor</h2>
                        <p>Necesitas un código de invitación de tu club</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="registro-form">
                        {/* Código de Club - OBLIGATORIO */}
                        <div className="form-group" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid #fbbf24' }}>
                            <label style={{ color: '#fbbf24' }}>🔑 Código de Invitación del Club *</label>
                            <input
                                type="text"
                                name="codigoUnico"
                                value={formData.codigoUnico}
                                onChange={handleChange}
                                placeholder="Ingresa el código proporcionado por tu club"
                                required
                                style={{ textTransform: 'uppercase' }}
                            />
                            <small className="form-hint">Este código te lo debe proporcionar el dueño de tu club</small>
                        </div>

                        {/* Foto de perfil (URL) */}
                        <div className="form-group logo-upload">
                            <label>Foto de Perfil (URL opcional)</label>
                            <div className="logo-container">
                                <div className="logo-preview">
                                    {formData.foto ? (
                                        <img src={formData.foto} alt="Preview" onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Error+URL"} />
                                    ) : (
                                        <span className="logo-placeholder">📷</span>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    name="foto"
                                    value={formData.foto}
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    className="input-url-logo"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nombre Completo *</label>
                            <input
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                placeholder="Tu nombre completo"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Apodo de Competidor *</label>
                                <input
                                    type="text"
                                    name="apodo"
                                    value={formData.apodo}
                                    onChange={handleChange}
                                    placeholder="Tu apodo único"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>DNI *</label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    placeholder="12345678"
                                    maxLength="8"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico *</label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contraseña *</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Contraseña *</label>
                                <input
                                    type="password"
                                    name="confirmarContrasena"
                                    value={formData.confirmarContrasena}
                                    onChange={handleChange}
                                    placeholder="Repetir contraseña"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Registrarme"
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/login">Inicia sesión aquí</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroCompetidor;
