package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.*;
import com.Robotech.BackEnd_Robotech.repositorio.IEnfrentamientoRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.IIdentificadorRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnfrentamientoServiceImp implements IEnfrentamientoServicio {

    private final IInscripcionServicio inscripcionServicio;
    private final IClubServicio clubServicio;
    private final ICompetidorServicio competidorServicio;
    private final IEnfrentamientoRepositorio enfrentamientoRepositorio;
    private final IIdentificadorRepositorio identificadorRepositorio;
    private final ITorneoServicio torneoServicio;

    @Autowired
    public EnfrentamientoServiceImp(IClubServicio clubServicio,
                                    ICompetidorServicio competidorServicio,
                                    IIdentificadorRepositorio identificadorRepositorio,
                                    IInscripcionServicio inscripcionServicio,
                                    IEnfrentamientoRepositorio enfrentamientoRepositorio,
                                    ITorneoServicio torneoServicio) {
        this.inscripcionServicio = inscripcionServicio;
        this.enfrentamientoRepositorio = enfrentamientoRepositorio;
        this.torneoServicio = torneoServicio;
        this.identificadorRepositorio = identificadorRepositorio;
        this.clubServicio = clubServicio;
        this.competidorServicio = competidorServicio;
    }

    @Override
    public void generarEnfrentamientos(int torneoId) throws Exception {
        Torneo torneo = torneoServicio.obtenerPorId(torneoId);
        List<Competidor> competidores;
        List<Enfrentamiento> combates = enfrentamientoRepositorio.findAllByTorneo(torneo);
        competidores = obtenerCompetidoresPorTorneo(torneoId);
        if ((combates == null || combates.isEmpty()) && (competidores.size() == torneo.getCantidad())){
            // Paso 1: Obtener competidores por torneo
            competidores = obtenerCompetidoresPorTorneo(torneoId);

            // Paso 2: Aleatorizar los competidores
            List<Competidor> competidoresAleatorios = mezclarCompetidoresAleatoriamente(competidores);

            // Paso 3: Crear los enfrentamientos para la primera ronda
            List<Enfrentamiento> enfrentamientos = crearEnfrentamientos(competidoresAleatorios, torneoId, 1);

            // Paso 4: Registrar los enfrentamientos y guardamos el nuevo estado del torneo
            torneoServicio.modificarEstado(torneo.getId(), "En curso");
            registrarEnfrentamientos(enfrentamientos);
        }else {
            if (competidores.size() < torneo.getCantidad()){
                throw new Exception("No hay suficientes competidores para este torneo.");
            }
            throw new Exception("Ya se han generado enfrentamientos para este torneo.");
        }
    }

    private List<Competidor> obtenerCompetidoresPorTorneo(int torneoId) throws Exception {
        // Obtener los competidores inscritos en el torneo
        return inscripcionServicio.listarInscripcionPorTorneo(torneoId)
                .stream()
                .map(Inscripcion::getCompetidor)
                .collect(Collectors.toList());
    }

    private List<Competidor> mezclarCompetidoresAleatoriamente(List<Competidor> competidores) {
        Collections.shuffle(competidores);  // Aleatoriza la lista de competidores
        return competidores;
    }

    private List<Enfrentamiento> crearEnfrentamientos(List<Competidor> competidores, int torneoId, int ronda) throws Exception {
        List<Enfrentamiento> enfrentamientos = new ArrayList<>();
        Torneo torneo = torneoServicio.obtenerPorId(torneoId);

        for (int i = 0; i < competidores.size(); i += 2) {
            Competidor competidor1 = competidores.get(i);
            Competidor competidor2 = (i + 1 < competidores.size()) ? competidores.get(i + 1) : null;

            Enfrentamiento enfrentamiento = new Enfrentamiento();
            enfrentamiento.setCompetidor1(competidor1);
            enfrentamiento.setCompetidor2(competidor2);
            enfrentamiento.setEstado("PENDIENTE");
            enfrentamiento.setTorneo(torneo);
            enfrentamiento.setRonda(ronda);

            enfrentamientos.add(enfrentamiento);
        }

        return enfrentamientos;
    }

    private void registrarEnfrentamientos(List<Enfrentamiento> enfrentamientos) {
        enfrentamientoRepositorio.saveAll(enfrentamientos);
    }

    @Override
    public void registrarResultadoEnfrentamiento(int enfrentamientoId, int puntaje1, int puntaje2) throws Exception {
        Enfrentamiento enfrentamiento = enfrentamientoRepositorio.findById(enfrentamientoId)
                .orElseThrow(() -> new Exception("Enfrentamiento no encontrado"));

        // Asignar los puntajes
        enfrentamiento.setPuntaje_1(puntaje1);
        enfrentamiento.setPuntaje_2(puntaje2);
        actualizarPuntajes(enfrentamiento.getCompetidor1(),puntaje1);
        actualizarPuntajes(enfrentamiento.getCompetidor2(),puntaje2);
        // Determinar el ganador
        Competidor ganador = determinarGanador(enfrentamiento);
        if (ganador != null) {
            enfrentamiento.setGanador(ganador);
        }
        enfrentamiento.setEstado("FINALIZADO");  // Marcar el enfrentamiento como finalizado

        enfrentamientoRepositorio.save(enfrentamiento);
    }
    private void actualizarPuntajes(Competidor competidor, int puntaje) throws Exception {
        if (competidor == null) return;
        // 1. Sumar puntos al competidor (Siempre se hace)
        competidorServicio.modificarPuntoDeCompetidor(competidor, puntaje);
        // 2. Sumar puntos al Club (Solo si existe la relación en la tabla intermedia)
        Identificador identificador = identificadorRepositorio.findByCompetidor(competidor);
        // Verificamos que exista el identificador y que tenga un club asociado
        if (identificador != null && identificador.getClub() != null) {
            Club club = identificador.getClub();
            // Calculamos el 30% (o el porcentaje que definas)
            int puntosParaElClub = (int) Math.round(puntaje * 0.3);

            clubServicio.modificarPuntoDeClub(club, puntosParaElClub);
        }
    }

    private Competidor determinarGanador(Enfrentamiento enfrentamiento) {
        if (enfrentamiento.getPuntaje_1() > enfrentamiento.getPuntaje_2()) {
            return enfrentamiento.getCompetidor1();
        } else if (enfrentamiento.getPuntaje_1() < enfrentamiento.getPuntaje_2()) {
            return enfrentamiento.getCompetidor2();
        }
        return null;  // Si hay empate
    }

    @Override
    public void generarSiguienteRonda(int torneoId, int rondaActual) throws Exception {
        Torneo torneo = torneoServicio.obtenerPorId(torneoId);
        List<Enfrentamiento> enfrentamientos = enfrentamientoRepositorio.findByTorneoAndRonda(torneo, rondaActual);
        // Verificar si hay enfrentamientos pendientes
        boolean todosFinalizados = enfrentamientos.stream()
                .allMatch(enfrentamiento -> "FINALIZADO".equals(enfrentamiento.getEstado()));
        if (!todosFinalizados) {
            throw new Exception("No todos los enfrentamientos de la ronda actual han finalizado. No se puede continuar.");
        }
        // Obtener los ganadores de la ronda actual
        List<Competidor> ganadores = obtenerGanadores(enfrentamientos);
        if (ganadores.size() == 1){
            torneoServicio.modificarEstado(torneo.getId(),"Finalizado");
            throw new Exception("El ganador del torneo es: " + ganadores.getFirst().getApodo());
        }
        // Crear los enfrentamientos para la siguiente ronda
        int siguienteRonda = rondaActual + 1;

        List<Enfrentamiento> nuevosEnfrentamientos = crearEnfrentamientos(ganadores, torneoId, siguienteRonda);

        // Registrar los nuevos enfrentamientos para la siguiente ronda
        registrarEnfrentamientos(nuevosEnfrentamientos);
    }

    @Override
    public List<Enfrentamiento> obtenerEnfrentamientoPorTorneo(int torneoId) throws Exception {
        Torneo torneo = torneoServicio.obtenerPorId(torneoId);
        return enfrentamientoRepositorio.findAllByTorneo(torneo);
    }

    private List<Competidor> obtenerGanadores(List<Enfrentamiento> enfrentamientos) {
        List<Competidor> ganadores = new ArrayList<>();
        for (Enfrentamiento enfrentamiento : enfrentamientos) {
            if (enfrentamiento.getGanador() != null) {
                ganadores.add(enfrentamiento.getGanador());
            }
        }
        return ganadores;
    }
}
