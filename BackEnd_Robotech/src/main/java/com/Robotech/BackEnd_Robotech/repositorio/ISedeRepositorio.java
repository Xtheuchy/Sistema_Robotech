package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ISedeRepositorio extends JpaRepository<Sede, Integer> {
    public boolean existsByNombreSede(String nombreSede);
    public Sede findByNombreSede(String nombreSede);

}
