// src/componentes/AsideBar.jsx
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo_claro.png'
import { useAuth } from '../context/AuthContext';

const AsideBar = ({ className }) => {
    // Ya no extraemos 'usuario' porque no lo mostraremos aquí
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    // Estilos reutilizables
    // Estado base: Gris transparente
    // Hover: Blanco con sombra suave (Efecto "Card" flotante)
    const linkStyle = "flex items-center gap-3 px-4 py-3 mx-3 rounded-xl text-gray-500 font-medium transition-all duration-200 hover:bg-white hover:text-blue-600 hover:shadow-sm group mb-1";

    // Iconos centrados y con animación sutil
    const iconStyle = "w-6 text-center text-lg transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-500";

    return (
        <aside className={`${className} bg-gray-50 h-screen border-r border-gray-200 flex flex-col font-sans`}>

            {/* --- 1. LOGO --- */}
            {/* Un poco más alto para dar aire al inicio */}
            <div className="h-24 flex items-center justify-center mb-2">
                <picture className='w-40 transition-opacity hover:opacity-80'>
                    <img className='w-full h-auto object-contain' src={Logo} alt="Logo pagina administrativa" />
                </picture>
            </div>

            {/* --- 2. NAVEGACIÓN --- */}
            <nav className='flex-1 overflow-y-auto custom-scrollbar py-2'>
                <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu</p>

                <ul className='flex flex-col'>
                    <li>
                        <Link className={linkStyle} to="/">
                            <span className={iconStyle}><i className="fa-solid fa-chart-line"></i></span>
                            <span>DashBoard</span>
                        </Link>
                    </li>
                    <li>
                        <Link className={linkStyle} to="/usuarios">
                            <span className={iconStyle}><i className="fa-solid fa-users"></i></span>
                            <span>Usuarios</span>
                        </Link>
                    </li>
                    <li>
                        <Link className={linkStyle} to="/torneos">
                            <span className={iconStyle}><i className="fa-solid fa-trophy"></i></span>
                            <span>Torneos</span>
                        </Link>
                    </li>
                    <li>
                        <Link className={linkStyle} to="/clubes">
                            <span className={iconStyle}><i className="fa-solid fa-user-group"></i></span>
                            <span>Clubes</span>
                        </Link>
                    </li>
                    <li>
                        <Link className={linkStyle} to="/organizacion">
                            <span className={iconStyle}><i className="fa-solid fa-gear"></i></span>
                            <span>Organización</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* --- 3. CERRAR SESIÓN --- */}
            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm"
                >
                    <i className="fa-solid fa-square-xmark"></i>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
}
export default AsideBar;