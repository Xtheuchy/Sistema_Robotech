import React, { useState } from 'react';
import { usuarioServicio } from '../service/userService';

function BotonAgregarUsuario({ enUsuarioAgregado }) {
    // 1. Estado para controlar si el modal
    const [modalAbierto, setModalAbierto] = useState(false);

    // 2. Estado para los datos del formulario
    const initialState = {
        nombres: '',
        correo: '',
        rol: '',
        dni: '',
        foto: '',
        password: ''
    };
    const [formData, setFormData] = useState(initialState);

    // 3. Estados para la carga y errores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 4. Funciones para abrir y cerrar el modal
    const abrirModal = () => setModalAbierto(true);

    const cerrarModal = () => {
        setModalAbierto(false);
        setFormData(initialState); // Resetea el formulario
        setError(null); // Limpia errores
    };

    // 5. Manejador para actualizar el estado del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 6. Patrón Regex para la contraseña
    // Min. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo (?&$)
    const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[?&$]).{8,}$";
    const passwordTitle = "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y uno de estos símbolos: ? & $";

    // 7. Manejador para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await usuarioServicio.registrarUsuario(formData);
            alert('¡Usuario registrado con éxito!');
            cerrarModal();
            if (enUsuarioAgregado) {
                enUsuarioAgregado();
            }
        } catch (err) {
            // Muestra el error que viene del backend
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* --- El Botón que abre el modal --- */}
            <button onClick={abrirModal} className="boton-agregar bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                Registrar Nuevo Usuario
            </button>

            {/* --- El Modal -> solo se muestra si esta abierto (TRUE) --- */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center p-4 bg-[#5e5e5e67]" onClick={cerrarModal}>
                    <div className=" bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

                        <button className="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-4xl font-bold bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200" onClick={cerrarModal}>
                            &times;
                        </button>

                        <div className="p-1 border-2 border-gray-400">
                            <h2 className="text-2xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>

                            <form onSubmit={handleSubmit}>
                                {/* Nombres */}
                                <div className="form-group mb-4">
                                    <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">Nombres:</label>
                                    <input
                                        type="text"
                                        id="nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* Correo */}
                                <div className="form-group mb-4">
                                    <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo:</label>
                                    <input
                                        type="email"
                                        id="correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* DNI */}
                                <div className="form-group mb-4">
                                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI:</label>
                                    <input
                                        type="text"
                                        id="dni"
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* Rol */}
                                <div className="form-group mb-4">
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
                                    <select
                                        id="rol"
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                                    >
                                        <option value="" disabled selected hidden>-- Selecciona un Rol --</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Juez">Juez</option>
                                    </select>
                                </div>

                                {/* Foto URL */}
                                <div className="form-group mb-4">
                                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">Foto (URL):</label>
                                    <input
                                        type="url"
                                        id="foto"
                                        name="foto"
                                        value={formData.foto}
                                        onChange={handleInputChange}
                                        placeholder="default.png o http://..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* Password */}
                                <div className="form-group mb-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        pattern={passwordPattern}
                                        title={passwordTitle}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                    <small className="text-xs text-gray-500 mt-1 block">{passwordTitle}</small>
                                </div>

                                {/* --- Botón de Enviar--- */}
                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="boton-submit w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Agregando...' : 'Agregar Usuario'}
                                    </button>
                                </div>

                                {/* Mensaje de Error */}
                                {error && <div className="error-mensaje mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BotonAgregarUsuario;