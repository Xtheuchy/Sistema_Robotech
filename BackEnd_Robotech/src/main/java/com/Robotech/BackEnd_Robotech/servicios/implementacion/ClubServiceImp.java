package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.repositorio.IClubRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IClubServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class ClubServiceImp implements IClubServicio {
    @Autowired
    private IClubRepositorio clubRepositorio;

    @Override
    public List<Club> listarClubes() throws Exception {
        return clubRepositorio.findAll();
    }

    @Override
    public Club registrarClub(Club club) throws Exception {
        LocalDate date = LocalDate.now();
        club.setCreado_en(date);
        return clubRepositorio.save(club);
    }

    @Override
    public void eliminarPorId(int id) throws Exception {
        clubRepositorio.findById(id);
    }

    @Override
    public Club buscarPorID(int id) throws Exception {
        return clubRepositorio.findById(id)
                .orElseThrow(()->new Exception("Club con id: "+ id +" no encontrado "));
    }
}
