package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioServicio {
    public List<Usuario> listarUsuarios() throws Exception;

    public Usuario agregarUsuario(Usuario usuario) throws Exception;

    public Usuario obtenerUsuarioPorId(Integer id) throws Exception;

    public void eliminarUsuario(Integer id) throws Exception;

    public Usuario actualizarUsuario(Integer id, Usuario usuario) throws Exception;

    public Usuario obtenerUsuarioPorCorreo(String correo) throws Exception;

    // Valida la contraseña del usuario bd y lo que ingreso
    public boolean verificarPassword(String rawPassword, String encodedPassword);

    public boolean validarCorreo(String correo);

    public List<Usuario> listarAdministradoryJuez() throws Exception;

    // Valida si la contraseña es segura
    public boolean validarPassword(String password) throws Exception;

    // Validar DNI
    public boolean validarDni(String dni) throws Exception;

    public List<Usuario> listarJueces() throws Exception;

}
