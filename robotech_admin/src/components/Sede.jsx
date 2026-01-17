import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { sedeServicio } from '../service/sedeService';

const Sedes = () => {
    // estados principales de datos y ui
    const [sedes, setSedes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    // estados para controlar el modal y el formulario
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEnEdicion, setIdEnEdicion] = useState(null);

    const [form, setForm] = useState({
        nombreSede: '',
        direccion: '',
        capacidad: 0
    });

    // trae la lista de sedes desde el backend
    const cargarSedes = async () => {
        setCargando(true);
        try {
            const data = await sedeServicio.listarSedes();
            setSedes(data);
        } catch (err) {
            console.error("Error cargando sedes:", err);
        } finally {
            setCargando(false);
        }
    };

    // al ingresar a la pagina carga los datos necesarios
    useEffect(() => { cargarSedes(); }, []);

    // filtra la lista visualmente segun el texto de busqueda
    const sedesFiltradas = sedes.filter(sede =>
        sede.nombreSede.toLowerCase().includes(busqueda.toLowerCase()) ||
        sede.direccion.toLowerCase().includes(busqueda.toLowerCase())
    );

    // prepara el estado para crear una nueva sede
    const abrirModalCrear = () => {
        setForm({ nombreSede: '', direccion: '', capacidad: 0 });
        setModoEdicion(false); setIdEnEdicion(null); setModalAbierto(true);
    };

    // carga los datos de la sede seleccionada para editar
    const abrirModalEditar = (sede) => {
        setForm({ nombreSede: sede.nombreSede, direccion: sede.direccion, capacidad: sede.capacidad });
        setModoEdicion(true); setIdEnEdicion(sede.id); setModalAbierto(true);
    };

    const cerrarModal = () => { setModalAbierto(false); setForm({ nombreSede: '', direccion: '', capacidad: 0 }); };
    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

    // envia el formulario para crear o actualizar
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modoEdicion) {
                await sedeServicio.actualizarSede(idEnEdicion, form);
                setSedes(sedes.map(s => s.id === idEnEdicion ? { ...s, ...form } : s));
            } else {
                const nuevaSede = await sedeServicio.registrarSede(form);
                setSedes([...sedes, nuevaSede || { ...form, id: Date.now() }]);
            }
            cerrarModal();
            Swal.fire({
                icon: 'success',
                title: modoEdicion ? '¡Sede Actualizada!' : '¡Sede Registrada!',
                text: modoEdicion ? 'La sede se ha actualizado correctamente.' : 'La sede se ha registrado correctamente.',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al procesar la solicitud: ${error.toString()}`
            });
        }
    };

    // elimina la sede tras confirmacion
    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar esta sede?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await sedeServicio.eliminarSede(id);
                setSedes(sedes.filter(s => s.id !== id));
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminada!',
                    text: 'La sede ha sido eliminada correctamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error al eliminar la sede: ${error.toString()}`
                });
            }
        }
    };

    return (
        <main className="font-sans  min-h-screen">

            <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

                {/* cabecera con titulo y buscador */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-building text-blue-600"></i>
                            Sedes
                        </h2>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-56">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <i className="fa-solid fa-search text-xs"></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full py-2 pl-9 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            />
                        </div>

                        <button onClick={abrirModalCrear} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors text-sm font-medium whitespace-nowrap">
                            <i className="fa-solid fa-plus mr-2"></i>
                            Nuevo
                        </button>
                    </div>
                </header>

                {/* tabla de resultados */}
                <div className="overflow-hidden border border-gray-100 rounded-lg">
                    {cargando ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Cargando...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-semibold">
                                    <tr>
                                        <th className="p-3 border-b">Nombre</th>
                                        <th className="p-3 border-b">Dirección</th>
                                        <th className="p-3 border-b text-center">Cap.</th>
                                        <th className="p-3 border-b text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {sedesFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-6 text-center text-gray-400">
                                                Sin resultados.
                                            </td>
                                        </tr>
                                    ) : (
                                        sedesFiltradas.map((sede) => (
                                            <tr key={sede.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="p-3 font-medium text-gray-700">{sede.nombreSede}</td>

                                                <td className="p-3 text-gray-500 truncate max-w-[150px]" title={sede.direccion}>
                                                    {sede.direccion}
                                                </td>

                                                <td className="p-3 text-center">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                                        {sede.capacidad}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex justify-end gap-2">
                                                    <button onClick={() => abrirModalEditar(sede)} className="text-gray-400 cursor-pointer  hover:text-blue-600 transition-colors">
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button onClick={() => handleEliminar(sede.id)} className="text-gray-400 cursor-pointer  hover:text-red-500 transition-colors">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* modal de formulario */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <article className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <header className="px-5 py-3 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">
                                {modoEdicion ? 'Editar Sede' : 'Nueva Sede'}
                            </h3>
                            <button onClick={cerrarModal} className="text-gray-400 cursor-pointer hover:text-gray-600">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="p-5 space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE</label>
                                <input type="text" name="nombreSede" value={form.nombreSede} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ej: Sede Central" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">DIRECCIÓN</label>
                                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ej: Av. Perú 123" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">CAPACIDAD</label>
                                <input type="number" name="capacidad" value={form.capacidad} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" min="1" required />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={cerrarModal} className="cursor-pointer px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="cursor-pointer px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm">Guardar</button>
                            </div>
                        </form>
                    </article>
                </div>
            )}
        </main>
    );
};

export default Sedes;