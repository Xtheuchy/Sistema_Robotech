import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registroCompetidor } from "../service/apiService";
import "./Registro.css";
import robotImg from "../../assets/imagenes/robot13.png";

const RegistroCompetidor = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        apodo: "",
        edad: "",
        correo: "",
        telefono: "",
        contrasena: "",
        confirmarContrasena: "",
        logo: null,
        codigoClub: "",
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) return "El nombre es requerido";
        if (!formData.apellido.trim()) return "El apellido es requerido";
        if (!formData.apodo.trim()) return "El apodo es requerido";
        if (!formData.edad || formData.edad < 8) return "La edad debe ser mayor a 8 años";
        if (!formData.correo.trim()) return "El correo es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) return "Correo inválido";
        if (!formData.telefono.trim()) return "El teléfono es requerido";
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
            // Preparar datos para enviar
            const dataToSend = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                apodo: formData.apodo,
                edad: parseInt(formData.edad),
                correo: formData.correo,
                telefono: formData.telefono,
                password: formData.contrasena,
                contrasena: formData.contrasena, // Enviar ambos por seguridad de API
                codigoClub: formData.codigoClub || null,
                logo: formData.logo // Enviar URL directa
            };

            // Limpiar codigoClub si es vacío para evitar problemas
            if (!dataToSend.codigoClub) {
                delete dataToSend.codigoClub;
            }

            await registroCompetidor(dataToSend);
            setSuccess("¡Registro exitoso! Redirigiendo al login...");

            setTimeout(() => {
                navigate("/login/competidor");
            }, 2000);
        } catch (err) {
            if (err.message.includes("ya está registrado") || err.message.includes("existe")) {
                setError("Este correo ya está registrado. Por favor usa otro correo o inicia sesión.");
            } else {
                setError(err.message || "Error al registrar. Intenta nuevamente.");
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
                        <p>Completa todos los campos para registrarte</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="registro-form">
                        {/* Foto de perfil */}
                        {/* Foto de perfil (URL) */}
                        <div className="form-group logo-upload">
                            <label>Foto de Perfil (URL)</label>
                            <div className="logo-container">
                                <div className="logo-preview">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Preview" onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Error+URL"} />
                                    ) : (
                                        <span className="logo-placeholder">📷</span>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    name="logo"
                                    value={formData.logo || ""}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    className="input-url-logo"
                                />
                            </div>
                            <small className="form-hint">Pega el enlace de tu foto (debe ser una URL pública)</small>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido *</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Tu apellido"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Apodo *</label>
                                <input
                                    type="text"
                                    name="apodo"
                                    value={formData.apodo}
                                    onChange={handleChange}
                                    placeholder="Tu apodo de competidor"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Edad *</label>
                                <input
                                    type="number"
                                    name="edad"
                                    value={formData.edad}
                                    onChange={handleChange}
                                    placeholder="18"
                                    min="8"
                                    max="99"
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

                        <div className="form-group">
                            <label>Teléfono *</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="+51 999 999 999"
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
                                    placeholder="Mínimo 6 caracteres"
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

                        <div className="form-group">
                            <label>Código de Club (opcional)</label>
                            <input
                                type="text"
                                name="codigoClub"
                                value={formData.codigoClub}
                                onChange={handleChange}
                                placeholder="RT-XXXXXX"
                            />
                            <small className="form-hint">Si perteneces a un club, ingresa el código proporcionado</small>
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
                            <Link to="/login/competidor">Inicia sesión aquí</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroCompetidor;
