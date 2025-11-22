package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ICategoriaRepositorio extends JpaRepository<Categoria,Integer> {
    public Categoria findByNombre(String nombre);
}
