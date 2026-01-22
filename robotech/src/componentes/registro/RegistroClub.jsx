import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarClub } from "../../api";
import "./Registro.css";
import robotImg from "../../assets/imagenes/robot13.png";

const RegistroClub = () => {
    const [formData, setFormData] = useState({
        responsableNombre: "",
        responsableCorreo: "",
        responsableContrasena: "",
        confirmarContrasena: "",
        responsableDni: "",
        responsableFoto: "", // Foto del propietario
        nombreClub: "",
        direccion: "",
        telefono: "",
        logo: null,
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
        if (!formData.responsableNombre.trim()) return "El nombre del responsable es requerido";
        if (!formData.responsableCorreo.trim()) return "El correo es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.responsableCorreo)) return "Correo inválido";
        if (!formData.responsableDni.trim()) return "El DNI es requerido";
        if (formData.responsableDni.length !== 8) return "El DNI debe tener 8 dígitos";
        if (!formData.nombreClub.trim()) return "El nombre del club es requerido";
        if (!formData.direccion.trim()) return "La dirección es requerida";
        if (!formData.telefono.trim()) return "El teléfono es requerido";
        if (!formData.responsableContrasena || formData.responsableContrasena.length < 6)
            return "La contraseña debe tener al menos 6 caracteres";
        if (formData.responsableContrasena !== formData.confirmarContrasena)
            return "Las contraseñas no coinciden";
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
            // Estructura según RegistroClubDTO del backend
            const dataToSend = {
                nombres: formData.responsableNombre,
                correo: formData.responsableCorreo,
                dni: formData.responsableDni,
                foto: formData.responsableFoto || "", // Foto del propietario
                password: formData.responsableContrasena,
                nombreClub: formData.nombreClub,
                direccion_fiscal: formData.direccion,
                telefono: formData.telefono,
                logo: formData.logo || ""
            };

            await registrarClub(dataToSend);
            setSuccess("¡Registro exitoso! Tu solicitud está pendiente de aprobación.");

            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data || err.message;
            if (typeof errorMsg === 'string' && (errorMsg.includes("ya está registrado") || errorMsg.includes("existe"))) {
                setError("Este correo, DNI o nombre de club ya está registrado.");
            } else {
                setError(typeof errorMsg === 'string' ? errorMsg : "Error al registrar. Intenta nuevamente.");
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
                            <h2>Registra tu <span className="text-gradient">Club</span></h2>
                            <p>Forma parte de la comunidad de robótica</p>
                        </div>
                    </div>
                    <div className="image-glow"></div>
                </div>

                {/* Lado derecho - Formulario */}
                <div className="registro-form-container">
                    <div className="form-header">
                        <span className="form-icon">🏢</span>
                        <h2>Registro Club</h2>
                        <p>Completa todos los campos para registrar tu club</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="registro-form">
                        {/* Logo del club (URL) */}
                        <div className="form-group logo-upload">
                            <label>Logo del Club (URL)</label>
                            <div className="logo-container">
                                <div className="logo-preview club-logo">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Preview" onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Error+URL"} />
                                    ) : (
                                        <span className="logo-placeholder">🏢</span>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    name="logo"
                                    value={formData.logo || ""}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    placeholder="https://ejemplo.com/logo.jpg"
                                    className="input-url-logo"
                                />
                            </div>
                            <small className="form-hint">Pega el enlace de tu logo (debe ser una URL pública)</small>
                        </div>

                        <div className="form-section-title">👤 Datos del Responsable</div>

                        <div className="form-group">
                            <label>Nombre Completo del Responsable *</label>
                            <input
                                type="text"
                                name="responsableNombre"
                                value={formData.responsableNombre}
                                onChange={handleChange}
                                placeholder="Nombre completo"
                                required
                            />
                        </div>

                        <div className="form-group logo-upload">
                            <label>Foto del Responsable (URL opcional)</label>
                            <div className="logo-container">
                                <div className="logo-preview">
                                    {formData.responsableFoto ? (
                                        <img src={formData.responsableFoto} alt="Foto" onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Error+URL"} />
                                    ) : (
                                        <span className="logo-placeholder">👤</span>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    name="responsableFoto"
                                    value={formData.responsableFoto}
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    className="input-url-logo"
                                />
                            </div>
                            <small className="form-hint">Foto de perfil del propietario del club</small>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>DNI del Responsable *</label>
                                <input
                                    type="text"
                                    name="responsableDni"
                                    value={formData.responsableDni}
                                    onChange={handleChange}
                                    placeholder="12345678"
                                    maxLength="8"
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
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico (terminar con @robotech.com) *</label>
                            <input
                                type="email"
                                name="responsableCorreo"
                                value={formData.responsableCorreo}
                                onChange={handleChange}
                                placeholder="correo@robotech.com"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contraseña *</label>
                                <input
                                    type="password"
                                    name="responsableContrasena"
                                    value={formData.responsableContrasena}
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

                        <div className="form-section-title">🏢 Datos del Club</div>

                        <div className="form-group">
                            <label>Nombre del Club *</label>
                            <input
                                type="text"
                                name="nombreClub"
                                value={formData.nombreClub}
                                onChange={handleChange}
                                placeholder="Tech Warriors"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección del Club *</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Av. Tecnología 123, Lima"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Registrar Club"
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

export default RegistroClub;
