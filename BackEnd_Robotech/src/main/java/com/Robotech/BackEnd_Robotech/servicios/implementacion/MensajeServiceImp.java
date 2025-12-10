package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Mensaje;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.IMensajeRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IMensajeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MensajeServiceImp implements IMensajeServicio {
    @Autowired
    private IMensajeRepositorio mensajeRepositorio;

    @Override
    public Mensaje obtenerPorUsuario(Usuario usuario) throws Exception{
        return mensajeRepositorio.findFirstByUsuarioOrderByFechaMsjDesc(usuario);
    }
    @Override
    public Mensaje registrarMensaje(Mensaje mensaje) {
        LocalDateTime hoy = LocalDateTime.now();
        mensaje.setFechaMsj(hoy);
        return mensajeRepositorio.save(mensaje);
    }
    @Override
    public void eliminarMensajePorId(int id) {
        mensajeRepositorio.deleteById(id);
    }

    @Override
    public Mensaje buscarMensajePorId(int id) throws Exception {
        return mensajeRepositorio.findById(id)
                .orElseThrow(()-> new Exception("Mensaje con id "+id+" no encontrado"));
    }
}
