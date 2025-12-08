package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.modelo.Inscripcion;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.repositorio.IInscripcionRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InscripcionServiceImp implements IInscripcionServicio {
    private final IInscripcionRepositorio inscripcionRepositorio;
    private final ITorneoServicio torneoServicio;
    private final ICompetidorServicio competidorServicio;

    @Autowired
    public InscripcionServiceImp(ICompetidorServicio competidorServicio,IInscripcionRepositorio inscripcionRepositorio,ITorneoServicio torneoServicio){
        this.inscripcionRepositorio = inscripcionRepositorio;
        this.torneoServicio = torneoServicio;
        this.competidorServicio = competidorServicio;
    }
    @Override
    public List<Inscripcion> listarInscripcionPorTorneo(int id) throws Exception {
        List<Inscripcion> inscripciones;
        Torneo torneo = torneoServicio.obtenerPorId(id);
        inscripciones = inscripcionRepositorio.findAlldByTorneo(torneo);
        if (inscripciones == null || inscripciones.isEmpty()){
           throw new Exception("El torneo aún no tiene inscripciones registradas.");
        }
        return inscripciones;
    }

    @Override
    public Inscripcion agregarInscripcion(RegistroInscripcionDTO inscripcionDTO) throws Exception {
        Competidor competidor = competidorServicio.buscarPorId(inscripcionDTO.getCompetidorId());
        Torneo torneo = torneoServicio.obtenerPorId(inscripcionDTO.getTorneoId());
        List<Inscripcion> inscripcions = listarInscripcionPorTorneo(inscripcionDTO.getTorneoId());
        if (!(inscripcions.size() == torneo.getCantidad())){
            Inscripcion inscripcion = new Inscripcion(torneo,competidor);
            return inscripcionRepositorio.save(inscripcion);
        }else {
            throw new Exception("El torneo ha alcanzado el número máximo de inscripciones.");
        }
    }

    @Override
    public void eliminarInscripcionPorId(int id) throws Exception {

    }
}
