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
                    <li className='cursor-pointer p-3 hover:bg-sky-200 transition-all rounded-lg'><i class="fa-solid fa-chart-line"></i> <Link to="/">DashBoard</Link></li>
                    <li className='cursor-pointer p-3 hover:bg-sky-200 transition-all rounded-lg'><i class="fa-solid fa-trophy"></i> Torneos</li>
                    <li className='cursor-pointer p-3 hover:bg-sky-200 transition-all rounded-lg'><i class="fa-solid fa-users"></i> Usuarios</li>
                    <li className='cursor-pointer p-3 hover:bg-sky-200 transition-all rounded-lg'><i class="fa-solid fa-square-xmark"></i> Cerrar sesión</li>
                </ul>
            </nav>
        </aside>
    )
}
export default AsideBar;