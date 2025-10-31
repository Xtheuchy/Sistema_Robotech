import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Para el enlace a "Registro"

// 1. Recibimos la prop 'onLoginSuccess' que definimos en App.jsx
const LoginPage = ({ onLoginSuccess }) => {
    // 2. Estados locales para controlar los inputs del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Para manejar errores

    // 3. Función que se ejecuta al enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        // --- VALIDACIÓN Y AUTENTICACIÓN ---
        // En un proyecto real, aquí harías la llamada a tu API (backend)
        // con fetch() o axios()
        //
        // const respuesta = await miApi.post('/login', { email, password });

        // --- SIMULACIÓN DE LOGIN ---
        // Vamos a simular que el login es exitoso si no está vacío
        if (email === "admin@correo.com" && password === "123456") {
            console.log("¡Login exitoso!");
            setError('');

            // 4. ¡LA PARTE MÁS IMPORTANTE!
            // Llamamos a la función que nos pasó el componente App.jsx
            // para decirle que el estado 'isLoggedIn' debe ser true.
            onLoginSuccess();
        } else {
            // Simulación de error
            setError('Credenciales incorrectas. (Prueba con admin@correo.com y 123456)');
        }
    };
    return (
        // Contenedor principal que centra el formulario
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            {/* Tarjeta del formulario */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">

                <h1 className="text-2xl font-bold text-center text-gray-900">
                    Iniciar Sesión
                </h1>

                {/* Formulario */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Campo de Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email} // Conectado al estado
                            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="tu@correo.com"
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password} // Conectado al estado
                            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Mensaje de Error (si existe) */}
                    {error && (
                        <p className="text-sm text-center text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Botón de Enviar */}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                {/* Enlace a Registro */}
                <p className="text-sm text-center text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-500">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;