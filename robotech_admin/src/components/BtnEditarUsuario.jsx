import React, { useState, useEffect } from 'react';
import { usuarioServicio } from '../service/userService';

// Recibe 2 props:
// 1. usuario: El objeto de usuario (DTO) de esta fila
// 2. onUsuarioActualizado: La función para refrescar la lista principal
function BtnEditarUsuario({ usuario, onUsuarioActualizado }) {

    // --- LÓGICA DEL BOTÓN ---
    const [modalAbierto, setModalAbierto] = useState(false);
    const abrirModal = () => setModalAbierto(true);
    const cerrarModal = () => {
        setModalAbierto(false);
        setError(null); // Limpia errores al cerrar
    };

    // 1. Estado para los datos del formulario
    const [formData, setFormData] = useState({
        nombres: '',
        correo: '',
        rol: '',
        dni: '',
        foto: ''
    });

    // 2. Estados para la carga y errores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Solo carga los datos si el modal está abierto y tenemos un usuario
        if (modalAbierto && usuario) {
            setFormData({
                nombres: usuario.nombres || '',
                correo: usuario.correo || '',
                rol: usuario.rolNombre || '',
                dni: usuario.dni || '',
                foto: usuario.foto || ''
            });
        }
    }, [modalAbierto, usuario]);

    // 3. Manejador para actualizar el estado del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 4. Manejar el envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await usuarioServicio.actualizarUsuario(usuario.id, formData);
            cerrarModal(); 
            onUsuarioActualizado(); //Recarga la pagina

        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* --- El Botón --- */}
            <button
                className="boton-accion editar bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={abrirModal}
            >
                Editar
            </button>

            {/* --- El Modal --- */}
            {modalAbierto && (
                <div className="modal-overlay fixed inset-0 z-50 bg-[#2525254e] bg-opacity-50 flex items-center justify-center p-4" onClick={cerrarModal}>
                    <div className="modal-content bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

                        <button className="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200" onClick={cerrarModal}>&times;</button>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuario</h2>

                            <form onSubmit={handleSubmit}>
                                {/* Nombres */}
                                <div className="form-group mb-4">
                                    <label htmlFor={`nombres-edit-${usuario.id}`} className="block text-sm font-medium text-gray-700 mb-1">Nombres:</label>
                                    <input
                                        type="text"
                                        id={`nombres-edit-${usuario.id}`} 
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* Correo */}
                                <div className="form-group mb-4">
                                    <label htmlFor={`correo-edit-${usuario.id}`} className="block text-sm font-medium text-gray-700 mb-1">Correo:</label>
                                    <input
                                        type="email"
                                        id={`correo-edit-${usuario.id}`}
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* DNI */}
                                <div className="form-group mb-4">
                                    <label htmlFor={`dni-edit-${usuario.id}`} className="block text-sm font-medium text-gray-700 mb-1">DNI:</label>
                                    <input
                                        type="text"
                                        id={`dni-edit-${usuario.id}`}
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* Rol */}
                                <div className="form-group mb-4">
                                    <label htmlFor={`rol-edit-${usuario.id}`} className="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
                                    <select
                                        id={`rol-edit-${usuario.id}`}
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleInputChange}                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                                    >
                                        <option value="" disabled selected hidden>-- Selecciona un Rol --</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Juez">Juez</option>
                                    </select>
                                </div>

                                {/* Foto (URL) */}
                                <div className="form-group mb-6">
                                    <label htmlFor={`foto-edit-${usuario.id}`} className="block text-sm font-medium text-gray-700 mb-1">Foto (URL):</label>
                                    <input
                                        type="text"
                                        id={`foto-edit-${usuario.id}`}
                                        name="foto"
                                        value={formData.foto}
                                        onChange={handleInputChange}
                                        placeholder="default.png o http://..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* Botón de Enviar */}
                                <div className="form-actions">
                                    <button type="submit" className="boton-submit w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                                        {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                                    </button>
                                </div>

                                {error && <div className="error-mensaje mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BtnEditarUsuario;