package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.repositorio.IRolRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IRolServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolServiceImp implements IRolServicio {
    @Autowired
    private IRolRepositorio rolRepositorio;
    @Override
    public List<Rol> listarRoles() throws Exception {
        return rolRepositorio.findAll();
    }
    @Override
    public Rol agregarRol(Rol rol) throws Exception {
        return rolRepositorio.save(rol);
    }

    @Override
    public Rol obtenerPorNombre(String nombre) throws Exception {
        return rolRepositorio.findByNombre(nombre)
                .orElseThrow(()->new Exception("Nombre no encontrado "+ nombre));
    }
}
