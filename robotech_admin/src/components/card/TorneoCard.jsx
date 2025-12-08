import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { torneoServicio } from "../../service/torneoService";
import { Link } from "react-router-dom";
const TorneoCard = ({ tournament, cargarTorneo }) => {
    // 1. Estado para controlar si el modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [error, setError] = useState(null);
    // Funciones para abrir y cerrar el modal
    const abrirModal = () => setModalAbierto(true);

    const cerrarModal = () => {
        setModalAbierto(false);
        setError(null); // Limpia errores
    };

    const [formTorneo, setFormTorneo] = useState({
        id: "",
        categoria: "",
        nombre_torneo: "",
        descripcion_torneo: "",
        foto: "",
        cantidad: 8,
        fecha_inicio: "",
        fecha_final: "",
        estado: "",
        sede: ""
    });

    useEffect(() => {
        // Solo carga los datos si el modal está abierto y tenemos un usuario
        if (modalAbierto && tournament) {
            setFormTorneo({
                id: tournament.id,
                categoria: tournament.nombreCategoria,
                nombre_torneo: tournament.nombreTorneo,
                descripcion_torneo: tournament.descripcionTorneo,
                foto: tournament.fotoTorneo,
                cantidad: tournament.cantidadParticipantes,
                fecha_inicio: tournament.fechaInicio,
                fecha_final: tournament.fechaFinal,
                estado: tournament.estado,
                sede: tournament.nombreSede
            });
        }
    }, [modalAbierto, tournament]);
    // Manejador para actualizar el estado del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormTorneo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    //Manejar el envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await torneoServicio.actualizarTorneo(formTorneo);
            cargarTorneo()
            cerrarModal();
            return Swal.fire({
                title: "Torneo actualizado correctamente",
                icon: "success",
            });
        } catch (err) {
            setError(err.toString());
        }
    };
    const handleEliminar = async (id, nombre) => {
        // 1. Lanzamos el modal de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Estás a punto de eliminar a "${nombre}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        // 2. Evaluamos si el usuario confirmó
        if (result.isConfirmed) {
            try {
                // Mostramos un 'loading' opcional mientras elimina (buena práctica de UX)
                Swal.showLoading();
                await torneoServicio.eliminarTorneo(id);

                // 3. Mostramos el mensaje de Éxito
                await Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El torneo ha sido eliminado correctamente.',
                    icon: 'success',
                    showConfirmButton: true
                });

                await cargarTorneo();

            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: `${err.toString()}`,
                });
            }
        }
    };

    return (
        <>
            <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-xs flex flex-col border border-gray-100">
                {/* HEADER / IMAGEN */}
                <header className="relative h-40 overflow-hidden"> {/* Reduje la altura de 48 a 40 para mantener proporción */}
                    <img
                        src={tournament.fotoTorneo}
                        alt={`Imagen del torneo ${tournament.nombreTorneo}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide shadow-sm 
                ${tournament.estado === 'Abierto' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {tournament.estado}
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to from-black/70 to-transparent p-3 pt-8">
                        <span className="text-white text-[10px] font-semibold bg-indigo-600 px-2 py-1 rounded shadow-sm">
                            {tournament.nombreCategoria}
                        </span>
                    </div>
                </header>

                {/* CONTENIDO */}
                <section className="p-4 flex-1 flex flex-col"> {/* Reduje padding de 5 a 4 */}
                    <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        <a href={`/torneo/${tournament.id}`} title={tournament.nombreTorneo}>
                            {tournament.nombreTorneo}
                        </a>
                    </h2>

                    <p className="text-gray-600 text-xs line-clamp-2 mb-4">
                        {tournament.descripcionTorneo}
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs text-gray-600 mt-auto">
                        <div className="col-span-2 flex items-center gap-2">
                            <i className="fa-solid fa-calendar-days text-indigo-500 w-4 text-center"></i>
                            <span>
                                {new Date(tournament.fechaInicio).toLocaleDateString()} - {new Date(tournament.fechaFinal).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-users text-indigo-500 w-4 text-center"></i>
                            <span>{tournament.cantidadParticipantes} Jug.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-location-dot text-indigo-500 w-4 text-center"></i>
                            <span className="truncate" title={tournament.nombreSede}>{tournament.nombreSede}</span>
                        </div>
                    </div>
                </section>

                {/* FOOTER CON 3 ACCIONES */}
                <footer className="p-4 pt-0 mt-2 flex items-center gap-2">
                    {/* Botón Principal */}
                    <Link
                        to={`/DetalleTorneo/${tournament.id}`}
                        className="flex-1 text-center py-2 px-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors text-xs uppercase tracking-wider"
                    >
                        Ver Detalles
                    </Link>

                    {/* Acciones */}
                    <div className="flex gap-1 border-l border-gray-200 pl-2 ml-1">

                        {((tournament.estado === "Borrador") || (tournament.estado === "Publico")) && <button
                            onClick={abrirModal}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                            title="Editar"
                        >
                            <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>}
                        

                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                            onClick={() => handleEliminar(tournament.id, tournament.nombreTorneo)}
                            title="Eliminar"
                        >
                            <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </footer>
            </article>

            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={cerrarModal}>
                    {/* Contenedor del Modal */}
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* HEADER (Fijo) */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-trophy text-indigo-600"></i>
                                Editar Torneo
                            </h2>
                            <button
                                onClick={cerrarModal}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        {/* BODY (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="editTorneoForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Nombre del Torneo (Full Width) */}
                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="nombre_torneo" className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
                                    <input
                                        type="text"
                                        id="nombre_torneo"
                                        name="nombre_torneo"
                                        value={formTorneo.nombre_torneo}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Ej: Torneo Titanes de Acero"
                                    />
                                </div>

                                {/* Foto URL (Full Width) */}
                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700">URL de la Foto</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-image text-gray-400"></i>
                                        </div>
                                        <input
                                            type="url"
                                            id="foto"
                                            name="foto"
                                            value={formTorneo.foto}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label htmlFor="descripcion_torneo" className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        id="descripcion_torneo"
                                        name="descripcion_torneo"
                                        value={formTorneo.descripcion_torneo}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* --- FECHAS --- */}
                                <div className="space-y-1">
                                    <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        id="fecha_inicio"
                                        name="fecha_inicio"
                                        value={formTorneo.fecha_inicio.split('T')[0]}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="fecha_final" className="block text-sm font-medium text-gray-700">Fecha Final</label>
                                    <input
                                        type="date"
                                        id="fecha_final"
                                        name="fecha_final"
                                        value={formTorneo.fecha_final.split('T')[0]}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                {/* --- SELECTS (Categoría y Sede) --- */}
                                <div className="space-y-1">
                                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <div className="relative">
                                        <select
                                            id="categoria"
                                            name="categoria" // O idCategoria si manejas IDs
                                            value={formTorneo.categoria}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {/* Aquí deberías mapear tu array de categorías */}
                                            <option value="sumo">Sumo</option>

                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                                    <div className="relative">
                                        <select
                                            id="sede"
                                            name="sede"
                                            value={formTorneo.sede}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {/* Aquí deberías mapear tu array de sedes */}
                                            <option value="Centro de Convenciones">Centro de Convenciones</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                {/*Cantidad*/}
                                <div className="space-y-1">
                                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Max. Participantes</label>
                                    <select
                                        name="cantidad"
                                        id="cantidad"
                                        value={formTorneo.cantidad}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                    >
                                        <option value={8}>8 Max.</option>
                                        <option value={16}>16 Max.</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        id="estado"
                                        name="estado"
                                        value={formTorneo.estado}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                    >
                                        <option value="Borrador">Borrador</option>
                                        <option value="Publico">Público</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                </div>

                                {error && (
                                    <div className="md:col-span-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        {error}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* FOOTER (Fijo) */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={cerrarModal}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="editTorneoForm" // Vincula este botón al form de arriba
                                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default TorneoCard;