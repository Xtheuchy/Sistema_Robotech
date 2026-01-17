import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { usuarioServicio } from '../service/userService';

/**
 * Componente botón que abre un modal para editar usuarios existentes
 * @param {Object} usuario - Objeto con los datos del usuario a editar
 * @param {Function} onUsuarioActualizado - Callback que se ejecuta al actualizar exitosamente
 */
function BtnEditarUsuario({ usuario, onUsuarioActualizado }) {

    const [modalAbierto, setModalAbierto] = useState(false);
    const abrirModal = () => setModalAbierto(true);
    const cerrarModal = () => {
        setModalAbierto(false);
        setError(null);
    };

    const [formData, setFormData] = useState({
        nombres: '',
        correo: '',
        rol: '',
        dni: '',
        foto: '',
        estado: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (modalAbierto && usuario) {
            setFormData({
                nombres: usuario.nombres || '',
                correo: usuario.correo || '',
                rol: usuario.rol || '',
                dni: usuario.dni || '',
                foto: usuario.foto || '',
                estado: usuario.estado || ''
            });
        }
    }, [modalAbierto, usuario]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await usuarioServicio.actualizarUsuario(usuario.id, formData);
            cerrarModal();
            Swal.fire({
                icon: 'success',
                title: '¡Usuario Actualizado!',
                text: 'Los datos se han guardado correctamente.',
                showConfirmButton: false,
                timer: 2000
            });
            onUsuarioActualizado();

        } catch (err) {
            setError(err.toString());
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: err.toString()
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="cursor-pointer group/btn relative p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={abrirModal}
                title="Editar información"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>

            {modalAbierto && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
                    onClick={cerrarModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>
                                <p className="text-sm text-gray-500 mt-1">Actualizando datos de <span className="font-semibold text-blue-600">{usuario.nombres}</span></p>
                            </div>
                            <button
                                className="cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
                                onClick={cerrarModal}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor={`nombres-edit-${usuario.id}`} className="text-left block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nombres Completos</label>
                                        <input
                                            type="text"
                                            id={`nombres-edit-${usuario.id}`}
                                            name="nombres"
                                            value={formData.nombres}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor={`correo-edit-${usuario.id}`} className="block text-xs text-left font-semibold text-gray-500 uppercase tracking-wide mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            id={`correo-edit-${usuario.id}`}
                                            name="correo"
                                            value={formData.correo}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor={`dni-edit-${usuario.id}`} className="text-left block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">DNI</label>
                                        <input
                                            type="text"
                                            id={`dni-edit-${usuario.id}`}
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor={`rol-edit-${usuario.id}`} className="text-left block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rol</label>
                                        <select
                                            id={`rol-edit-${usuario.id}`}
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        >
                                            <option value="" disabled hidden>-- Seleccionar --</option>
                                            <option value="Administrador">Administrador</option>
                                            <option value="Juez">Juez</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor={`foto-edit-${usuario.id}`} className="text-left block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Foto (URL)</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                id={`foto-edit-${usuario.id}`}
                                                name="foto"
                                                value={formData.foto}
                                                onChange={handleInputChange}
                                                placeholder="https://..."
                                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                            />
                                            {formData.foto && (
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                    <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor={`estado-edit-${usuario.id}`} className="text-left block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado</label>
                                        <select
                                            id={`estado-edit-${usuario.id}`}
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block focus:bg-white transition-colors"
                                        >
                                            <option value="" disabled hidden>-- Seleccionar --</option>
                                            <option value="ACTIVO">Activo</option>
                                            <option value="PENDIENTE">Pendiente</option>
                                        </select>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-center gap-2">
                                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
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
                                                Actualizando...
                                            </>
                                        ) : (
                                            'Guardar Cambios'
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BtnEditarUsuario;