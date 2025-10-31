package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRolRepositorio extends JpaRepository<Rol, Integer> {
    public Optional<Rol> findByNombre(String nombre);
}
