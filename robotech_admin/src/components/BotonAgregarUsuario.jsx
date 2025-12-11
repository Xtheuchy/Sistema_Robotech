// src/componentes/BotonAgregarUsuario.jsx
import React, { useState } from 'react';
import { usuarioServicio } from '../service/userService';

function BotonAgregarUsuario({ enUsuarioAgregado }) {
    // estado para controlar si el modal esta abierto
    const [modalAbierto, setModalAbierto] = useState(false);

    // estado inicial del formulario
    const initialState = {
        nombres: '',
        correo: '',
        rol: '',
        dni: '',
        foto: '',
        password: '',
        estado: ''
    };
    const [formData, setFormData] = useState(initialState);

    // estados de carga y error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abrirModal = () => setModalAbierto(true);

    const cerrarModal = () => {
        setModalAbierto(false);
        setFormData(initialState);
        setError(null);
    };

    // actualiza el estado del formulario al escribir
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // regex para validar la contraseña
    const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[?&$]).{8,}$";
    const passwordTitle = "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y uno de estos símbolos: ? & $";

    // envia los datos al backend
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
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* boton principal para abrir el modal */}
            <button
                onClick={abrirModal}
                className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-200"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo Usuario</span>
            </button>

            {/* modal overlay */}
            {modalAbierto && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
                    onClick={cerrarModal}
                >
                    {/* contenedor del modal */}
                    <article
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >

                        {/* cabecera del modal */}
                        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
                                <p className="text-sm text-gray-500 mt-1">Complete la información para dar de alta un usuario.</p>
                            </div>
                            <button
                                className="cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
                                onClick={cerrarModal}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </header>

                        {/* cuerpo del formulario */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* nombres */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="nombres" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nombres Completos</label>
                                        <input
                                            type="text"
                                            id="nombres"
                                            name="nombres"
                                            value={formData.nombres}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej. Juan Pérez"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    {/* correo */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="correo" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            id="correo"
                                            name="correo"
                                            value={formData.correo}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="nombre@robotech.com"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    {/* dni */}
                                    <div>
                                        <label htmlFor="dni" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">DNI / Documento</label>
                                        <input
                                            type="text"
                                            id="dni"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    {/* rol */}
                                    <div>
                                        <label htmlFor="rol" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rol Asignado</label>
                                        <select
                                            id="rol"
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        >
                                            <option value="" disabled hidden>-- Seleccionar --</option>
                                            <option value="Administrador">Administrador</option>
                                            <option value="Juez">Juez</option>
                                        </select>
                                    </div>

                                    {/* password */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contraseña</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                pattern={passwordPattern}
                                                title={passwordTitle}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors pr-10"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">{passwordTitle}</p>
                                    </div>

                                    {/* foto */}
                                    <div>
                                        <label htmlFor="foto" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL Foto (Opcional)</label>
                                        <input
                                            type="url"
                                            id="foto"
                                            name="foto"
                                            value={formData.foto}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    {/* estado */}
                                    <div>
                                        <label htmlFor="estado" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado Inicial</label>
                                        <select
                                            id="estado"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        >
                                            <option value="" disabled hidden>-- Seleccionar --</option>
                                            <option value="ACTIVO">Activo</option>
                                            <option value="PENDIENTE">Pendiente</option>
                                        </select>
                                    </div>
                                </div>

                                {/* mensaje de error */}
                                {error && (
                                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-center gap-2" role="alert">
                                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* botones de accion */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={cerrarModal}
                                        className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className={`cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all shadow-md flex items-center justify-center min-w-[140px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar Usuario'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </article>
                </div>
            )}
        </>
    );
}
export default BotonAgregarUsuario;