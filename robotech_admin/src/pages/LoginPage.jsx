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
        <div className="login-container min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-900">Iniciar Sesión <br/> ROBOTECH</h2>
                <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo:</label>
                    <input
                        type="email"
                        id="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                </div>
                {/* Muestra el error de la API */}
                {error && <p className="error-mensaje p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}
export default LoginPage;