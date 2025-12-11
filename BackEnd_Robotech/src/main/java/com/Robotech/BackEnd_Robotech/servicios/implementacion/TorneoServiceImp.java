package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.DTO.RegistroTorneoDTO;
import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Inscripcion;
import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.repositorio.IInscripcionRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.ITorneoRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICategoriaServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ISedeServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TorneoServiceImp implements ITorneoServicio {
    private final ITorneoRepositorio torneoRepositorio;
    private final ICategoriaServicio categoriaServicio;
    private final ISedeServicio sedeServicio;
    private final IInscripcionRepositorio inscripcionRepositorio;
    @Autowired
    public TorneoServiceImp(IInscripcionRepositorio inscripcionRepositorio,ISedeServicio sedeServicio,ICategoriaServicio categoriaServicio,ITorneoRepositorio torneoRepositorio){
        this.torneoRepositorio = torneoRepositorio;
        this.categoriaServicio = categoriaServicio;
        this.sedeServicio = sedeServicio;
        this.inscripcionRepositorio = inscripcionRepositorio;
    }
    @Override
    public List<Torneo> listarTorneos() throws Exception {
        return torneoRepositorio.findAll();
    }

    @Override
    public List<Torneo> listarTorneosPublicos() throws Exception {
        return torneoRepositorio.findAllByEstado("PUBLICO");
    }
    @Override
    public List<Torneo> listarTorneosBorrador() throws Exception {
        return torneoRepositorio.findAllByEstado("BORRADOR");
    }

    @Override
    public Torneo agregarTorneo(Torneo torneo) throws Exception {
        // Validar que el nombre del torneo sea diferente
        if (torneoRepositorio.existsByNombre(torneo.getNombre())){
            throw new Exception("Ya existe un torneo con el mismo nombre. Por favor, elija otro nombre.");
        }
        // Validación: Verificar que la fecha final no sea antes de la fecha de inicio
        if (torneo.getFechaFinal().isBefore(torneo.getFechaInicio())) {
            throw new Exception("La fecha final no puede ser anterior a la fecha de inicio.");
        }
        // Validación de inicio y final de torneo
        if (torneoRepositorio.existsByFechaInicioAndFechaFinal(torneo.getFechaInicio(),torneo.getFechaFinal())){
            throw new Exception("No puedes crear un torneo es esta sede durante estas fechas");
        }
        // Verificar si ya existe un torneo en la misma sede y con fechas durante otro torneo
        if (torneoRepositorio.existsBySedeAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(torneo.getSede(),torneo.getFechaFinal(),torneo.getFechaInicio())){
            throw new Exception("Ya hay un torneo en curso en esta sede durante estas fechas. Intente con otra sede o fechas.");
        }
        LocalDate hoy = LocalDate.now();
        torneo.setCreado_en(hoy);
        return torneoRepositorio.save(torneo);
    }

    @Override
    public Torneo modificarTorneo(RegistroTorneoDTO torneoDTO) throws Exception {
        Categoria categoria = categoriaServicio.buscarPorNombre(torneoDTO.getCategoria());
        Sede sede = sedeServicio.buscarPorNombre(torneoDTO.getSede());

        Torneo torneo = obtenerPorId(torneoDTO.getId());
        if (torneo.getEstado().equalsIgnoreCase("borrador")){
            torneo.setNombre(torneoDTO.getNombre_torneo());
            torneo.setFoto(torneoDTO.getFoto());
            torneo.setCantidad(torneoDTO.getCantidad());
            torneo.setCategoria(categoria);
            torneo.setSede(sede);
            torneo.setFechaInicio(torneoDTO.getFecha_inicio());
            torneo.setFechaFinal(torneoDTO.getFecha_final());
            torneo.setDescripcion(torneoDTO.getDescripcion_torneo());
            torneo.setEstado(torneoDTO.getEstado());
        }else{
            throw new Exception("El estado del torneo es : " + torneo.getEstado() + " no puede modificarse");
        }

        // Validación: Verificar que la fecha final no sea antes de la fecha de inicio
        if (torneo.getFechaFinal().isBefore(torneo.getFechaInicio())) {
            throw new Exception("La fecha final no puede ser anterior a la fecha de inicio.");
        }

        return torneoRepositorio.save(torneo);
    }

    @Override
    public Torneo modificarEstado(int id, String nuevoEstado) throws Exception {
        Torneo torneo;
        torneo = obtenerPorId(id);
        torneo.setEstado(nuevoEstado);
        return torneoRepositorio.save(torneo);
    }


    @Override
    public void eliminarPorId(int id) throws Exception {
        Torneo torneo = obtenerPorId(id);
        List<Inscripcion> inscripcions = inscripcionRepositorio.findAlldByTorneo(torneo);
        if (inscripcions == null || inscripcions.isEmpty()){
            torneoRepositorio.deleteById(id);
        }else {
            throw new Exception("El torneo ya tiene inscripciones no puede eliminarse!!");
        }
    }

    @Override
    public Torneo obtenerPorId(int id) throws Exception {
        return torneoRepositorio.findById(id).orElseThrow(() -> new Exception("Torneo con id " + id + " no encontrado"));
    }
}
