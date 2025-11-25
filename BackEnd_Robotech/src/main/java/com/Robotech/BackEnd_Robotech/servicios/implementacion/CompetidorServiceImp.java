package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.repositorio.ICompetidorRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompetidorServiceImp implements ICompetidorServicio {
    @Autowired
    private ICompetidorRepositorio competidorRepositorio;

    @Override
    public List<Competidor> listarCompetidor() throws Exception {
        return competidorRepositorio.findAll();
    }

    @Override
    public Competidor registrarCompetidor(Competidor competidor) throws Exception {
        if (competidorRepositorio.existsByApodo(competidor.getApodo())){
            throw new IllegalArgumentException("El Apodo de competidor 'LoboSolitario' ya está en uso.");
        }
        return competidorRepositorio.save(competidor);
    }

    @Override
    public void eliminarPorId(int id) throws Exception {
        competidorRepositorio.deleteById(id);
    }

    @Override
    public Competidor buscarPorId(int id) throws Exception{
        return competidorRepositorio.findById(id)
                .orElseThrow(()-> new Exception("Competidor no encontrado "+ id));
    }

    @Override
    public boolean verificarApodo(String apodo) throws Exception {
        return competidorRepositorio.existsByApodo(apodo);
    }
}
