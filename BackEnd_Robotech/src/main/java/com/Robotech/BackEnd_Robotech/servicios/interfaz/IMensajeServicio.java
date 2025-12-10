package com.Robotech.BackEnd_Robotech.servicios.interfaz;

import com.Robotech.BackEnd_Robotech.modelo.Mensaje;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;

import java.util.List;

public interface IMensajeServicio {
    public Mensaje obtenerPorUsuario(Usuario usuario) throws Exception;
    public Mensaje registrarMensaje(Mensaje mensaje) throws Exception;
    public void eliminarMensajePorId(int id) throws Exception;
    public Mensaje buscarMensajePorId(int id) throws Exception;
}
