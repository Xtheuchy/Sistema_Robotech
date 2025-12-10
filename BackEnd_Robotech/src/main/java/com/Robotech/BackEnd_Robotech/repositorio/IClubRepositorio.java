package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Club;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface IClubRepositorio extends JpaRepository<Club, Integer> {
    public Boolean existsByTelefono(String Telefono);
    public Club findByUsuario(Usuario usuario);
}
