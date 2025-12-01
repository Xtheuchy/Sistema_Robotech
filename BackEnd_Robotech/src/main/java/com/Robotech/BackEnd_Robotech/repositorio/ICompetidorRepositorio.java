package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Competidor;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ICompetidorRepositorio extends JpaRepository<Competidor, Integer> {
    public Boolean existsByApodo(String Apodo);
    public Competidor findByUsuario(Usuario usuario);
}
