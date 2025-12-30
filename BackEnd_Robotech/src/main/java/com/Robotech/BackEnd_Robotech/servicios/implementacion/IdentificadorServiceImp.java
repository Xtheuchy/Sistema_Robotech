package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.repositorio.IIdentificadorRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IIdentificadorServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IdentificadorServiceImp implements IIdentificadorServicio {
    @Autowired
    private IIdentificadorRepositorio identificadorRepositorio;

    @Override
    public Identificador registrarIdentificador(Identificador identificador) throws Exception {
            String codigoGenerado = UUID.randomUUID().toString().toUpperCase();
            identificador.setId(codigoGenerado);
            return identificadorRepositorio.save(identificador);
    }

    @Override
    public Identificador buscarIdentificador(String id) throws Exception {
        return identificadorRepositorio.findById(id)
                .orElseThrow(()->new Exception("id no encontrado "+ id));
    }

    @Override
    public Identificador editarIdentificador(Identificador identificador) throws Exception {
        return identificadorRepositorio.save(identificador);
    }

    @Override
    public List<Identificador> listarIdentificadorPorClub(Club club) throws Exception {
        return identificadorRepositorio.findAllByClub(club);
    }

    @Override
    public Identificador obtenerIdentificadorPorCompetidor(Competidor competidor) throws Exception {
        return identificadorRepositorio.findByCompetidor(competidor);
    }
}
