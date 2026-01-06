package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.DTO.CompetidorDTO;
import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.ICompetidorRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IClubServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IIdentificadorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompetidorServiceImp implements ICompetidorServicio {
    private final ICompetidorRepositorio competidorRepositorio;
    private final IIdentificadorServicio identificadorServicio;
    private final IClubServicio clubServicio;
    private final IUsuarioServicio usuarioRepositorio;

    @Autowired
    public CompetidorServiceImp(IUsuarioServicio usuarioRepositorio,IClubServicio clubServicio,ICompetidorRepositorio competidorRepositorio,IIdentificadorServicio identificadorServicio){
        this.competidorRepositorio = competidorRepositorio;
        this.identificadorServicio = identificadorServicio;
        this.clubServicio = clubServicio;
        this.usuarioRepositorio = usuarioRepositorio;

    }

    @Override
    public Competidor modificarCompetidor(CompetidorDTO competidorDTO) throws Exception {
        Competidor competidor = competidorRepositorio.findById(competidorDTO.getId())
                .orElseThrow(()->new Exception("No se encontro el competidor"));

        competidor.setApodo(competidorDTO.getApodo());
        Usuario usuario = usuarioRepositorio.obtenerUsuarioPorId(competidor.getUsuario().getId());

        usuario.setNombres(competidorDTO.getNombres());
        usuario.setCorreo(competidorDTO.getCorreo());
        usuario.setFoto(competidorDTO.getFoto());

        usuarioRepositorio.actualizarUsuario(usuario.getId(),usuario);
        return competidorRepositorio.save(competidor);
    }

    @Override
    public List<Competidor> listarCompetidor() throws Exception {
        return competidorRepositorio.findAll();
    }

    @Override
    public Competidor registrarCompetidor(Competidor competidor) throws Exception {
        if (competidorRepositorio.existsByApodo(competidor.getApodo())){
            throw new Exception("El apodo ya esta registrado elige uno diferente!!");
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

    @Override
    public Competidor buscarCompetidorPorUsuario(Usuario usuario) {
        return competidorRepositorio.findByUsuario(usuario);
    }

    @Override
    public List<CompetidorDTO> listarCompetidorPorClub(int clubId) throws Exception {
        Club club = clubServicio.buscarPorID(clubId);
        List<Identificador> identificadores = identificadorServicio.listarIdentificadorPorClub(club);
            return identificadores.stream()
                    .filter(identificador -> identificador.getCompetidor() != null) // Filtro para asegurar que el competidor no sea null
                    .map(identificador -> new CompetidorDTO(
                            identificador.getCompetidor().getId(),
                            identificador.getCompetidor().getApodo(),
                            identificador.getCompetidor().getUsuario().getNombres(),
                            identificador.getCompetidor().getUsuario().getCorreo(),
                            identificador.getCompetidor().getUsuario().getRol().getNombre(),
                            identificador.getCompetidor().getUsuario().getDni(),
                            identificador.getCompetidor().getUsuario().getFoto(),
                            identificador.getCompetidor().getUsuario().getEstado()
                    ))
                    .toList();
    }

    @Override
    public void modificarPuntoDeCompetidor(Competidor competidor, int cantidad) throws Exception {
        competidor.setPuntos(competidor.getPuntos()+cantidad);
        competidorRepositorio.save(competidor);
    }
}
