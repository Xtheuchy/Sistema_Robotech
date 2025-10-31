import { Link } from 'react-router-dom';
import Logo from '../assets/Logo_claro.png'
const AsideBar = ({className}) =>{
    return(
        <aside className={className}>
            <picture className='w-50 h-50'>
                <img className='w-max h-max' src={Logo} alt="Logo pagina administrativa" />
            </picture>
            <nav className='pt-3'>
                <ul className='flex flex-col gap-3'>
                    <li className='cursor-pointer hover:bg-sky-200 transition-all rounded-lg'><Link className='block p-3' to="/"><i class="fa-solid fa-chart-line"></i> DashBoard</Link></li>
                    <li className='cursor-pointer hover:bg-sky-200 transition-all rounded-lg'><Link className='block p-3' to="/sobre"><i class="fa-solid fa-trophy"></i> Torneos</Link></li>
                    <li className='cursor-pointer hover:bg-sky-200 transition-all rounded-lg'><Link className='block p-3' to="/sobre"><i class="fa-solid fa-users"></i>Usuarios</Link></li>
                    <li className='cursor-pointer hover:bg-sky-200 hover:text-red-500 transition-all rounded-lg'><Link className='block p-3' to="/sobre"><i class="fa-solid fa-square-xmark"></i> Cerrar sesión</Link></li>
                </ul>
            </nav>
        </aside>
    )
}
export default AsideBar;