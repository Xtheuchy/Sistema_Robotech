package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategoriaRepositorio extends JpaRepository<Categoria,Integer> {
    public Categoria findByNombre(String nombre);
    public boolean existsByNombre(String nombre);
}
