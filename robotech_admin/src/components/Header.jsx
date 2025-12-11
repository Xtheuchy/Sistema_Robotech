// src/componentes/Header.jsx
import { useAuth } from "../context/AuthContext";

const Header = ({ className }) => {
    // obtengo el usuario del contexto global
    const { usuario } = useAuth();

    return (
        // encabezado principal con fondo gris suave y borde inferior
        <header className={`${className} bg-gray-50 h-20 border-b border-gray-200 flex items-center justify-between px-8`}>

            {/* titulo del panel */}
            <div>
                <h1 className="text-xl font-bold text-gray-700 tracking-tight">
                    Panel de Administración
                </h1>
            </div>

            {/* seccion de perfil alineada a la derecha */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 h-10">

                {/* info de texto del usuario */}
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                        {usuario.rol}
                    </p>
                    <p className="text-xs text-gray-500 font-medium font-sans">
                        {usuario.correo}
                    </p>
                </div>

                {/* avatar con indicador de estado */}
                <div className="relative group cursor-pointer">
                    <picture>
                        <img
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm transition-transform group-hover:scale-105"
                            src={usuario.foto || "https://via.placeholder.com/150"}
                            alt="perfil de usuario"
                        />
                    </picture>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-gray-50"></span>
                </div>

            </div>
        </header>
    );
}

export default Header;