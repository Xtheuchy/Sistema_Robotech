package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Mensaje;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IMensajeRepositorio extends JpaRepository<Mensaje, Integer> {
    public Mensaje findFirstByUsuarioOrderByFechaMsjDesc(Usuario usuario);
}
