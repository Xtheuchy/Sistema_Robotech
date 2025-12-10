// src/componentes/Header.jsx
import { useAuth } from "../context/AuthContext";

const Header = ({ className }) => {
    const { usuario } = useAuth();

    return (
        // Aplicamos bg-gray-50 para el "gris suave" y border-b para separar del contenido
        <header className={`${className} bg-gray-50 h-20 border-b border-gray-200 flex items-center justify-between px-8`}>

            {/* Título Principal */}
            <div>
                <h1 className="text-xl font-bold text-gray-700 tracking-tight">
                    Panel de Administración
                </h1>
            </div>

            {/* Sección de Perfil */}
            {/* Alineamos items al centro y añadimos un borde izquierdo suave como separador */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 h-10">

                {/* Información de Texto (Alineado a la derecha) */}
                <div className="text-right hidden sm:block">
                    {/* El ROL destacado en negrita y color oscuro */}
                    <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                        {usuario.rol}
                    </p>
                    {/* El CORREO más pequeño y en gris para no saturar */}
                    <p className="text-xs text-gray-500 font-medium font-sans">
                        {usuario.correo}
                    </p>
                </div>

                {/* Avatar / Foto */}
                <div className="relative group cursor-pointer">
                    <picture>
                        <img
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm transition-transform group-hover:scale-105"
                            src={usuario.foto || "https://via.placeholder.com/150"}
                            alt="perfil de usuario"
                        />
                    </picture>
                    {/* Pequeño indicador (opcional) de estado */}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-gray-50"></span>
                </div>

            </div>
        </header>
    );
}

export default Header;