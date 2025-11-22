package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Identificador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IIdentificadorRepositorio extends JpaRepository<Identificador, Integer> {
    public Optional<Identificador> findById(String id);
}
