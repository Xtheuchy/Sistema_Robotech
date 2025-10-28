package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioServicio {
    public List<Usuario> listarUsuarios() throws Exception;
    public Usuario agregarUsuario(Usuario usuario) throws Exception;
    public Usuario obtenerUsuarioPorId(Integer id) throws Exception;
    public void eliminarUsuario(Integer id)throws Exception;
    public Usuario actualizarUsuario(Integer id, Usuario usuario)throws Exception ;
}
