package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IIdentificadorRepositorio extends JpaRepository<Identificador, Integer> {
    public Optional<Identificador> findById(String id);
    public List<Identificador> findAllByClub(Club club);
    public Identificador findByCompetidor(Competidor competidor);
}
