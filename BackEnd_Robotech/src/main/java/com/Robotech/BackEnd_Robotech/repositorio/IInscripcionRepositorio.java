package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Inscripcion;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IInscripcionRepositorio extends JpaRepository<Inscripcion, Integer> {
    public List<Inscripcion> findAlldByTorneo(Torneo torneo);
}
