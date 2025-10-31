// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importa el hook de Auth
import { login as loginServicio } from '../service/authService'; // 2. Importa el servicio de API

function LoginPage() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // 3. Obtiene la función "login" del CONTEXTO
    const { login } = useAuth();
    // 4. Hook para redirigir
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const credencialesDTO = { correo, password };
            const usuarioData = await loginServicio(credencialesDTO);
            const rolUsuario = usuarioData.rol.toUpperCase();
            if (rolUsuario !== 'ADMINISTRADOR' && rolUsuario !== 'JUEZ') {
                setError("Acceso denegado. Solo administradores y jueces pueden ingresar.");
                setLoading(false);
                return;
            }
            login(usuarioData);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <div className="form-group">
                    <label htmlFor="email">Correo:</label>
                    <input
                        type="email"
                        id="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* Muestra el error de la API */}
                {error && <p className="error-mensaje">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;