import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { torneoServicio } from "../../service/torneoService";
import { Link } from "react-router-dom";
// importamos los servicios necesarios para llenar los selects
import { categoriaServicio } from "../../service/categoriaService";
import { sedeServicio } from "../../service/sedeService";
import { usuarioServicio } from '../../service/userService';

const TorneoCard = ({ tournament, cargarTorneo }) => {
    // estado para controlar el modal y la carga de datos
    const [modalAbierto, setModalAbierto] = useState(false);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(false);

    // estados para las listas desplegables
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaSedes, setListaSedes] = useState([]);
    const [listaJueces, setListaJueces] = useState([]);

    // obtener fecha actual para validacion
    const today = new Date().toISOString().split('T')[0];

    // aca activo el loading antes de abrir el modal asi no parpadea el form viejo
    const abrirModal = () => {
        setLoadingData(true);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setError(null);
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
        sede: "",
        juez: ""
    });

    // efecto para cargar datos y listas cuando se abre el modal
    useEffect(() => {
        if (modalAbierto) {
            // carga paralela de todas las listas para los selects
            Promise.all([
                categoriaServicio.listarCategorias(),
                sedeServicio.listarSedes(),
                usuarioServicio.listarJueces()
            ]).then(([cats, sedes, jueces]) => {
                setListaCategorias(cats);
                setListaSedes(sedes);
                setListaJueces(jueces);
            }).catch(err => console.error("Error cargando listas", err))
                .finally(() => setLoadingData(false)); // desactiva el loading al terminar

            // lleno el formulario con los datos que ya tiene el torneo
            if (tournament) {
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
                    sede: tournament.nombreSede,
                    correoJuez: tournament.correoJuez || ""
                });
            }
        }
    }, [modalAbierto, tournament]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormTorneo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // funcion para enviar el formulario y actualizar
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await torneoServicio.actualizarTorneo(formTorneo);
            cargarTorneo(); // recargar la lista padre
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

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                await torneoServicio.eliminarTorneo(id);
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
                {/* header e imagen */}
                <header className="relative h-40 overflow-hidden">
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

                {/* contenido principal */}
                <section className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        <Link to={`/DetalleTorneo/${tournament.id}`} title={tournament.nombreTorneo}>
                            {tournament.nombreTorneo}
                        </Link>
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

                {/* footer con acciones */}
                <footer className="p-4 pt-0 mt-2 flex items-center gap-2">
                    <Link
                        to={`/DetalleTorneo/${tournament.id}`}
                        className="flex-1 text-center py-2 px-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors text-xs uppercase tracking-wider"
                    >
                        Ver Detalles
                    </Link>

                    <div className="flex gap-1 border-l border-gray-200 pl-2 ml-1">
                        {((tournament.estado === "Borrador") || (tournament.estado === "Publico")) &&
                            <button
                                onClick={abrirModal}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                title="Editar"
                            >
                                <i className="fa-solid fa-pen-to-square text-xs"></i>
                            </button>}

                        <button
                            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                            onClick={() => handleEliminar(tournament.id, tournament.nombreTorneo)}
                            title="Eliminar"
                        >
                            <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </footer>
            </article>

            {/* modal de edicion */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={cerrarModal}>
                    <article
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* header del modal */}
                        <header className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-trophy text-indigo-600"></i>
                                Editar Torneo
                            </h2>
                            <button onClick={cerrarModal} className="cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </header>

                        {/* cuerpo del modal */}
                        <section className="p-6 overflow-y-auto custom-scrollbar">
                            {/* muestro cargando o el formulario dependiendo del state */}
                            {loadingData ? (
                                <p className="text-center text-gray-500">Cargando datos...</p>
                            ) : (
                                <form id="editTorneoForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="md:col-span-2 space-y-1">
                                        <label htmlFor="nombre_torneo" className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
                                        <input type="text" id="nombre_torneo" name="nombre_torneo" value={formTorneo.nombre_torneo} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Ej: Torneo Titanes de Acero" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label htmlFor="foto" className="block text-sm font-medium text-gray-700">URL de la Foto</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i className="fa-solid fa-image text-gray-400"></i></span>
                                            <input type="url" id="foto" name="foto" value={formTorneo.foto} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label htmlFor="descripcion_torneo" className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea id="descripcion_torneo" name="descripcion_torneo" value={formTorneo.descripcion_torneo} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"></textarea>
                                    </div>

                                    {/* fechas con fieldset y validacion */}
                                    <fieldset className="contents">
                                        <div className="space-y-1">
                                            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                            <input
                                                type="date"
                                                id="fecha_inicio"
                                                name="fecha_inicio"
                                                min={today}
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
                                                min={formTorneo.fecha_inicio ? formTorneo.fecha_inicio.split('T')[0] : today}
                                                value={formTorneo.fecha_final.split('T')[0]}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                    </fieldset>

                                    {/* select categoria */}
                                    <div className="space-y-1">
                                        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                                        <div className="relative">
                                            <select id="categoria" name="categoria" value={formTorneo.categoria} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white">
                                                <option value="" disabled>Seleccionar...</option>
                                                {listaCategorias.map((cat, index) => <option key={index} value={cat.nombre}>{cat.nombre}</option>)}
                                            </select>
                                            <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></span>
                                        </div>
                                    </div>

                                    {/* select sede */}
                                    <div className="space-y-1">
                                        <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                                        <div className="relative">
                                            <select id="sede" name="sede" value={formTorneo.sede} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white">
                                                <option value="" disabled>Seleccionar...</option>
                                                {listaSedes.map((sed, index) => <option key={index} value={sed.nombreSede}>{sed.nombreSede}</option>)}
                                            </select>
                                            <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500"><i className="fa-solid fa-chevron-down text-xs"></i></span>
                                        </div>
                                    </div>

                                    {/* select juez */}
                                    <div className="space-y-1">
                                        <label htmlFor="juez" className="block text-sm font-medium text-gray-700">Juez Principal</label>
                                        <div className="relative">
                                            <select
                                                id="juez"
                                                name="correoJuez"
                                                value={formTorneo.correoJuez}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                                            >
                                                <option value="" disabled>Seleccionar Juez...</option>
                                                {listaJueces.map((juez) => (
                                                    <option key={juez.id} value={juez.j_correo}>
                                                        {juez.j_nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                                <i className="fa-solid fa-chevron-down text-xs"></i>
                                            </span>
                                        </div>
                                    </div>

                                    {/* cantidad */}
                                    <div className="space-y-1">
                                        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Max. Participantes</label>
                                        <select name="cantidad" id="cantidad" value={formTorneo.cantidad} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                                            <option value={8}>8 Max.</option>
                                            <option value={16}>16 Max.</option>
                                        </select>
                                    </div>

                                    {/* estado */}
                                    <div className="space-y-1 md:col-span-2">
                                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                                        <select id="estado" name="estado" value={formTorneo.estado} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
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
                            )}
                        </section>

                        {/* footer modal */}
                        <footer className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button type="button" onClick={cerrarModal} className="cursor-pointer px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors">Cancelar</button>
                            <button type="submit" form="editTorneoForm" className="cursor-pointer px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                <i className="fa-solid fa-floppy-disk"></i> Guardar Cambios
                            </button>
                        </footer>
                    </article>
                </div>
            )}
        </>
    )
}
export default TorneoCard;