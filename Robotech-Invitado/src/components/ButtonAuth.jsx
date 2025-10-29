const ButtonAuth = ({style,title,onClick}) =>{
    return(
        <button 
        className={style} 
        onClick={onClick}>
            {title}
        </button>
    )
}
export default ButtonAuth;