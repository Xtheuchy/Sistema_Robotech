import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <main className="min-h-10/12 flex flex-col items-center justify-center text-center font-sans">

            {/* contenedor visual del mensaje */}
            <section className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100">

                {/* icono grande animado */}
                <div className="text-8xl text-slate-200 mb-6">
                    <i className="fa-solid fa-robot fa-bounce"></i>
                </div>

                <h1 className="text-5xl font-extrabold text-slate-800 mb-2 tracking-tight">404</h1>

                <h2 className="text-xl font-bold text-slate-600 mb-4">
                    Página no encontrada
                </h2>

                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Parece que la ruta que intentas buscar no existe o se ha perdido en el sistema.
                </p>

                {/* boton para regresar al dashboard */}
                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-200 transition-all active:scale-95 w-full"
                >
                    <i className="fa-solid fa-house"></i>
                    Volver al Inicio
                </Link>

            </section>
        </main>
    );
}

export default NotFoundPage;