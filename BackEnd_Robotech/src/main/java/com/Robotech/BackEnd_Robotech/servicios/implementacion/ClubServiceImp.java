package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.DTO.ClubDTO;
import com.Robotech.BackEnd_Robotech.DTO.ModificarClubDTO;
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
        clubRepositorio.deleteById(id);
    }

    @Override
    public Club buscarPorID(int id) throws Exception {
        return clubRepositorio.findById(id)
                .orElseThrow(()->new Exception("Club con id: "+ id +" no encontrado "));
    }

    @Override
    public ClubDTO obtenerPorId(int id) throws Exception {
        Club club = clubRepositorio.findById(id)
                .orElseThrow(()->new Exception("Club con id: "+ id +" no encontrado "));
        return new ClubDTO(
                club.getId(),
                club.getUsuario().getId(),
                club.getUsuario().getNombres(),
                club.getUsuario().getFoto(),
                club.getUsuario().getCorreo(),
                club.getTelefono(),
                club.getNombre(),
                club.getDireccion_fiscal(),
                club.getLogo(),
                club.getEstado(),
                club.getCreado_en(),
                club.getPuntos()
        );
    }

    @Override
    public Club obtenerPorUsuario(Usuario usuario) throws Exception {
        return clubRepositorio.findByUsuario(usuario);
    }
    @Override
    public Club modificarClub(Club club) throws Exception {
        return clubRepositorio.save(club);
    }

    @Override
    public Club moficarDatosClub(ModificarClubDTO modificarClubDTO) throws Exception {
        Club club = clubRepositorio.findById(modificarClubDTO.getId())
                .orElseThrow(()->new Exception("Club con id : "+ modificarClubDTO.getId()+ " no encontrado!!"));
        club.setNombre(modificarClubDTO.getNombreClub());
        club.setTelefono(modificarClubDTO.getTelefonoClub());
        club.setLogo(modificarClubDTO.getLogo());
        club.setDireccion_fiscal(modificarClubDTO.getDireccionClub());
        return clubRepositorio.save(club);
    }

    @Override
    public void modificarPuntoDeClub(Club club, int cantidad) {
        club.setPuntos(club.getPuntos()+cantidad);
        clubRepositorio.save(club);
    }
}
