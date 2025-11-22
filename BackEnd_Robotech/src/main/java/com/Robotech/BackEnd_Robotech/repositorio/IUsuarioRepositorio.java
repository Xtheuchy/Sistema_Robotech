package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepositorio extends JpaRepository<Usuario , Integer> {
    public Optional<Usuario> findByNombres(String nombres);
    public Boolean existsByNombres(String nombres);
    public Boolean existsByCorreo(String correo);
    public Boolean existsByDni(String dni);
    public Optional<Usuario> findByCorreo(String correo);
    public Optional<Usuario> findByDni(String dni);
}
