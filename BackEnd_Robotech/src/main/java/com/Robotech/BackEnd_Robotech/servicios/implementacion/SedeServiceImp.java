package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.repositorio.ISedeRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.ITorneoRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SedeServiceImp implements ISedeServicio {
    @Autowired
    private ISedeRepositorio sedeRepositorio;
    @Autowired
    ITorneoRepositorio torneoRepositorio;

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
        Optional<Sede> sede = sedeRepositorio.findById(id);
        if (sede.isPresent()){
            Optional<Torneo> torneo = torneoRepositorio.findBySede(sede);
            if (torneo.isPresent()){
                throw new Exception("La sede, ya esta en uso");
            }
        }
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

    @Override
    public Sede modificarSede(Sede sede) throws Exception {
        // Verifica si la sede que se desea modificar existe
        Optional<Sede> sd = sedeRepositorio.findById(sede.getId());
        if (sd.isPresent()) {
            // Busca otra sede con el mismo nombre, excluyendo la sede que estamos modificando
            Sede sedePorNombre = sedeRepositorio.findByNombreSede(sede.getNombreSede());

            // Si se encuentra otra sede con el mismo nombre y no es la misma sede
            if (sedePorNombre != null && sedePorNombre.getId() != sede.getId()) {
                throw new Exception("El nombre: " + sede.getNombreSede() + " ya está en uso.");
            }
        } else {
            throw new Exception("Sede no encontrada.");
        }

        // Guarda los cambios si todo está bien
        return sedeRepositorio.save(sede);
    }

    @Override
    public Sede buscarPorId(int id) throws Exception {
        return sedeRepositorio.findById(id)
                .orElseThrow(() -> new Exception("Sede no encontrado con ID: " + id));
    }
}
