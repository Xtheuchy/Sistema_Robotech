package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Enfrentamiento;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IEnfrentamientoRepositorio extends JpaRepository<Enfrentamiento, Integer> {
    public List<Enfrentamiento> findAllByTorneo(Torneo torneo);
    List<Enfrentamiento> findByTorneoAndRonda(Torneo torneo, int rondaActual);
}
