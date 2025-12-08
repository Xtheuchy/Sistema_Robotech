package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.DTO.RegistroClubDTO;
import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.IClubRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IClubServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import com.Robotech.BackEnd_Robotech.util.SimilarityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClubServiceImp implements IClubServicio {
    private final IClubRepositorio clubRepositorio;
    private final IUsuarioServicio usuarioServicio;

    @Autowired
    public ClubServiceImp(IUsuarioServicio usuarioServicio, IClubRepositorio clubRepositorio){
        this.clubRepositorio = clubRepositorio;
        this.usuarioServicio = usuarioServicio;
    }

    @Override
    public List<Club> listarClubes() throws Exception {
        return clubRepositorio.findAll();
    }

    @Override
    public Club registrarClub(RegistroClubDTO registroClubDTO, Usuario usuario) throws Exception {
        List<Club> clubes = listarClubes();
        for (Club club1 : clubes) {
            if (SimilarityUtil.validarSimilitud(club1.getNombre(), registroClubDTO.getNombreClub())){
                throw new IllegalArgumentException("El nombre del club es demasiado similar a uno ya registrado.");
            }
            if (SimilarityUtil.validarSimilitud(club1.getDireccion_fiscal(), registroClubDTO.getDireccion_fiscal())){
                throw new IllegalArgumentException("La dirección del club es demasiado similar a uno ya registrado.");
            }
        }
        if (clubRepositorio.existsByTelefono(registroClubDTO.getTelefono())){
            throw new Exception("El telefono del club es igual a uno ya registrado");
        }
        Club club = new Club(
                usuario,
                registroClubDTO.getNombreClub(),
                registroClubDTO.getDireccion_fiscal(),
                registroClubDTO.getTelefono(),
                registroClubDTO.getLogo(),
                "PENDIENTE"
        );
        LocalDate date = LocalDate.now();
        club.setCreado_en(date);
        Usuario usuarioClub = usuarioServicio.agregarUsuario(usuario);
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

    @Override
    public Club modificarClub(Club club) throws Exception {
        return clubRepositorio.save(club);
    }
}
