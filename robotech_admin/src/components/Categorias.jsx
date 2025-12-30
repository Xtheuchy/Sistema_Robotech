import React, { useEffect, useState } from 'react';
import { categoriaServicio } from '../service/categoriaService';

const Categorias = () => {
  // estados para manejar la lista y la ui
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // estados para el modal y el formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    habilidad: '',
    peso_max: 0,
    peso_min: 0
  });

  // trae las categorias del backend
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const data = await categoriaServicio.listarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  // al ingresar a la pagina carga los datos necesarios
  useEffect(() => { cargarDatos(); }, []);

  // filtra la lista segun el buscador
  const datosFiltrados = categorias.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.descripcion && item.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // prepara el formulario para crear
  const handleOpenCreate = () => {
    setForm({ nombre: '', descripcion: '' });
    setModoEdicion(false);
    setModalOpen(true);
  };

  // carga los datos para editar
  const handleOpenEdit = (item) => {
    setForm({ nombre: item.nombre, descripcion: item.descripcion, habilidad:item.habilidad, peso_max:item.peso_max, peso_min:item.peso_min});
    setModoEdicion(true);
    setCurrentId(item.id);
    setModalOpen(true);
  };

  // envia el formulario para guardar o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await categoriaServicio.actualizarCategoria(currentId, form);
        setCategorias(categorias.map(c => c.id === currentId ? { ...c, ...form } : c));
      } else {
        const nuevo = await categoriaServicio.registrarCategoria(form);
        setCategorias([...categorias, nuevo || { ...form, id: Date.now() }]);
      }
      setModalOpen(false);
    } catch (error) {
      alert("Error al guardar " + error);
    }
  };

  // elimina la categoria tras confirmar
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar?")) {
      try {
        await categoriaServicio.eliminarCategoria(id);
        setCategorias(categorias.filter(c => c.id !== id));
      } catch (error) {
        alert("Error al eliminar " + error);
      }
    }
  };

  return (
    <main className="font-sans">

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* cabecera con titulo y acciones */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-blue-600"></i>
              Categorías
            </h2>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {/* buscador */}
            <div className="relative w-full sm:w-56">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fa-solid fa-search text-xs"></i>
              </span>
              <input
                type="text"
                className="w-full py-2 pl-9 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* boton nuevo */}
            <button
              onClick={handleOpenCreate}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors text-sm font-medium whitespace-nowrap"
            >
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
                    <th className="p-3 border-b">Descripción</th>
                    <th className="p-3 border-b text-right w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {datosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-6 text-center text-gray-400">
                        Sin resultados.
                      </td>
                    </tr>
                  ) : (
                    datosFiltrados.map((cat) => (
                      <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3 font-medium text-gray-700">
                          {cat.nombre}
                        </td>

                        <td className="p-3 text-gray-500 truncate max-w-[200px]" title={cat.descripcion}>
                          {cat.descripcion || '-'}
                        </td>

                        <td className="p-3 flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="text-gray-400 cursor-pointer  hover:text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="text-gray-400 cursor-pointer  hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
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

      {/* modal del formulario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <article className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">

            <header className="px-5 py-3 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <i className={`fa-solid ${modoEdicion ? 'fa-pen' : 'fa-plus'} text-blue-600 text-xs`}></i>
                {modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-times"></i>
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fa-solid fa-tag text-xs"></i>
                  </span>
                  <input
                    type="text"
                    className="w-full py-2 pl-9 pr-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Robótica"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">HABILIDAD</label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-gray-400">
                    <i className="fa-solid fa-align-left text-xs"></i>
                  </span>
                  <input
                    type='text'
                    className="w-full py-2 pl-9 pr-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={form.habilidad}
                    onChange={(e) => setForm({ ...form, habilidad: e.target.value })}
                    placeholder="Ingrese una habilidad especial"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">PESO MAX.</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fa-solid fa-tag text-xs"></i>
                  </span>
                  <input
                    type="number"
                    className="w-full py-2 pl-9 pr-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={form.peso_max}
                    onChange={(e) => setForm({ ...form, peso_max: e.target.value })}
                    placeholder="Cantidad máxima"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">PESO MIN.</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fa-solid fa-tag text-xs"></i>
                  </span>
                  <input
                    type="number"
                    className="w-full py-2 pl-9 pr-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={form.peso_min}
                    onChange={(e) => setForm({ ...form, peso_min: e.target.value })}
                    placeholder="Cantidad mínima"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIPCIÓN</label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-gray-400">
                    <i className="fa-solid fa-align-left text-xs"></i>
                  </span>
                  <textarea
                    className="w-full py-2 pl-9 pr-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Breve descripción..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </article>
        </div>
      )}

    </main>
  );
};

export default Categorias;