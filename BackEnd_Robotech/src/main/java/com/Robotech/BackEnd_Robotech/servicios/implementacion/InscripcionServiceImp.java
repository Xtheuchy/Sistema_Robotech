package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.DTO.RegistroInscripcionDTO;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import com.Robotech.BackEnd_Robotech.modelo.Inscripcion;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.repositorio.IIdentificadorRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.IInscripcionRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ICompetidorServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IInscripcionServicio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.ITorneoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class InscripcionServiceImp implements IInscripcionServicio {
    private final IInscripcionRepositorio inscripcionRepositorio;
    private final ITorneoServicio torneoServicio;
    private final ICompetidorServicio competidorServicio;
    private final IIdentificadorRepositorio identificadorRepositorio;

    @Autowired
    public InscripcionServiceImp(IIdentificadorRepositorio identificadorRepositorio,ICompetidorServicio competidorServicio,IInscripcionRepositorio inscripcionRepositorio,ITorneoServicio torneoServicio){
        this.inscripcionRepositorio = inscripcionRepositorio;
        this.torneoServicio = torneoServicio;
        this.competidorServicio = competidorServicio;
        this.identificadorRepositorio = identificadorRepositorio;
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
        // 0. Obtener entidades básicas
        Competidor competidor = competidorServicio.buscarPorId(inscripcionDTO.getCompetidorId());
        Torneo torneo = torneoServicio.obtenerPorId(inscripcionDTO.getTorneoId());
        List<Inscripcion> inscripcionesActuales = inscripcionRepositorio.findAlldByTorneo(torneo);

        // -------------------------------------------------------------------
        // VALIDACIÓN 1: CAPACIDAD DEL TORNEO
        // -------------------------------------------------------------------
        if (inscripcionesActuales.size() >= torneo.getCantidad()) {
            throw new Exception("El torneo ha alcanzado el número máximo de inscripciones.");
        }

        // VALIDACIÓN 2: MÁXIMO 2 DEL MISMO CLUB (Usando Identificadores)

        // Paso A: Buscar el identificador del competidor actual para saber su Club
        Identificador identCompetidorActual = identificadorRepositorio.findByCompetidor(competidor);

        // Solo validamos si el competidor tiene un identificador/club asignado
        if (identCompetidorActual != null && identCompetidorActual.getClub() != null) {

            // Paso B: Obtener TODOS los identificadores asociados a ese mismo Club
            List<Identificador> miembrosDelClub = identificadorRepositorio.findAllByClub(identCompetidorActual.getClub());

            // Paso C: Extraemos los IDs de los competidores validando que NO sean nulos
            List<Integer> idsCompetidoresDelClub = miembrosDelClub.stream()
                    .filter(ident -> ident.getCompetidor() != null)
                    .map(ident -> ident.getCompetidor().getId())
                    .toList();

            // Paso D: Contar cuántos de los inscritos actuales están en la lista de IDs de mi club
            long inscritosDeMiClub = inscripcionesActuales.stream()
                    .filter(inscripcion -> idsCompetidoresDelClub.contains(inscripcion.getCompetidor().getId()))
                    .count();

            if (inscritosDeMiClub >= 2) {
                throw new Exception("Cupo por club lleno: Ya hay 2 competidores del club '"
                        + identCompetidorActual.getClub().getNombre() + "' inscritos.");
            }
        }
        // RESTRICCIÓN DE 7 DÍAS POST-TORNEO
        // Buscamos la última inscripción por fecha final del torneo
        Optional<Inscripcion> ultimaInscripcion = inscripcionRepositorio
                .findTopByCompetidorIdOrderByTorneoFechaFinalDesc(competidor.getId());

        if (ultimaInscripcion.isPresent()) {
            // Obtenemos la fecha final del último torneo jugado
            LocalDate fechaFinUltimo = ultimaInscripcion.get().getTorneo().getFechaFinal();
            LocalDate fechaHoy = LocalDate.now();

            // Calculamos la diferencia en días
            long diasDiferencia = ChronoUnit.DAYS.between(fechaFinUltimo, fechaHoy);

            // Si el torneo ya terminó (dias >= 0) Y han pasado menos de 7 días
            if (diasDiferencia >= 0 && diasDiferencia < 7) {
                long diasRestantes = 7 - diasDiferencia;
                throw new Exception("Periodo de descanso obligatorio. Faltan " + diasRestantes + " días para poder inscribirte.");
            }
        }
        // GUARDAR INSCRIPCIÓN
        Inscripcion inscripcion = new Inscripcion(torneo, competidor);
        return inscripcionRepositorio.save(inscripcion);
    }
    @Override
    public void eliminarInscripcionPorId(int id) throws Exception {
        inscripcionRepositorio.deleteById(id);
    }
}
