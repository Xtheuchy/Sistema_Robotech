package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.repositorio.ISedeRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SedeServiceImp implements ISedeServicio {
    @Autowired
    private ISedeRepositorio sedeRepositorio;
    @Override
    public List<Sede> listarSedes() throws Exception {
        return sedeRepositorio.findAll();
    }

    @Override
    public Sede agregarSede(Sede sede) throws Exception {
        return sedeRepositorio.save(sede);
    }

    @Override
    public void eliminarPorId(int id) throws Exception {
        sedeRepositorio.deleteById(id);
    }

    @Override
    public boolean verificarNombreSede(String sede) throws Exception {
        return sedeRepositorio.existsByNombreSede(sede);
    }

    @Override
    public Sede buscarPorNombre(String nombre) throws Exception {
        return sedeRepositorio.findByNombreSede(nombre);
    }
}
