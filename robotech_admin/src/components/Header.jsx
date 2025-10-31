import { useAuth } from "../context/AuthContext";

const Header = ({className}) => {
    const {usuario, logout } = useAuth();
    return (
        <header className={className}>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <div className="flex w-55 gap-2">
                <picture>
                    <img 
                    className="w-[50px] h-[50px] object-cover"
                    src={usuario.foto}
                    alt="perfil de usuario" />
                </picture>
                <div>
                    <p className="font-medium">{usuario.rol}</p>
                    <p className="font-sans text-[14px] font-light">{usuario.correo}</p>
                </div>
            </div>
        </header>
    )
}
export default Header;