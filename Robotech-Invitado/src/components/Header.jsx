import { useState } from 'react';
import Logo from '../assets/Logo_robotech.png'
import ButtonAuth from './ButtonAuth';

const Header = () => {
    // --- PASO 2: Crea el estado para el menú móvil ---
    // Por defecto, está cerrado (false)
    const [menuAbierto, setMenuAbierto] = useState(false);

    const saludar = () => {
        alert("Inicia sesión")
    }
    // --- PASO 3: Función para alternar el estado ---
    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto); // Invierte el valor (false -> true)
    };

    return (
        // "relative" es necesario para que el menú desplegable (que usará "absolute")
        // se posicione correctamente debajo del header.
        <header className='relative flex h-24 bg-[#00A5D9] items-center justify-between pr-5 pl-5'>
            {/* --- LOGO --- */}
            <img
                src={Logo}
                alt="Robotech logo"
                className='h-20 w-auto object-contain'
            />
            {/* --- NAV DESKTOP (Se oculta en pantallas pequeñas) --- */}
            <nav className='hidden lg:flex'>
                <ul className='flex gap-3 text-gray-700 items-center'>
                    <li className='font-extrabold'>Inicio</li>
                    <li className='font-extrabold'>Sobre nosotros</li>
                    <li className='font-extrabold'>Clasificación</li>
                    <ButtonAuth
                        title="Solicitud de club"
                        style="font-extrabold"
                        onClick={saludar}
                    />
                    <ButtonAuth
                        title="Iniciar sesión"
                        style="font-extrabold"
                        onClick={saludar}
                    />
                </ul>
            </nav>

            {/* --- BOTÓN HAMBURGUESA MÓVIL (Se oculta en pantallas grandes) --- */}
            <nav className='lg:hidden'>
                {/* PASO 4: Conecta el botón al "toggleMenu" */}
                <button onClick={toggleMenu} className='text-gray-700 text-4xl'>
                    {/* Opcional: Cambia el ícono si el menú está abierto */}
                    {menuAbierto ? '✕' : '☰'}
                </button>
            </nav>

            {/* // --- PASO 5: EL MENÚ DESPLEGABLE MÓVIL ---
            // Se muestra solo si "menuAbierto" es true.
            */}
            {menuAbierto && (
                <div className="absolute top-24 left-0 w-full bg-white shadow-lg p-5 
                flex flex-col items-center gap-4 lg:hidden">
                    {/* Aquí repetimos los mismos enlaces del nav de desktop */}
                    <ul className='flex flex-col items-center gap-4 text-gray-700'>
                        <li className='font-extrabold'>Inicio</li>
                        <li className='font-extrabold'>Sobre nosotros</li>
                        <li className='font-extrabold'>Clasificación</li>
                        <ButtonAuth
                            title="Solicitud de club"
                            style="font-extrabold"
                            onClick={saludar}
                        />
                        <ButtonAuth
                            title="Iniciar sesión"
                            style="font-extrabold"
                            onClick={saludar}
                        />
                    </ul>
                </div>
            )}
        </header>
    )
}
export default Header;