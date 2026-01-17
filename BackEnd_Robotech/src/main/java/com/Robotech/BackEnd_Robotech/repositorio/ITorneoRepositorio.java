package com.Robotech.BackEnd_Robotech.repositorio;

import com.Robotech.BackEnd_Robotech.modelo.Categoria;
import com.Robotech.BackEnd_Robotech.modelo.Sede;
import com.Robotech.BackEnd_Robotech.modelo.Torneo;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ITorneoRepositorio extends JpaRepository<Torneo, Integer> {
    public List<Torneo> findAllByEstado(String estado);
    public Optional<Torneo> findByJuez(Usuario usuario);
    public Optional<Torneo> findByCategoria(Optional<Categoria> categoria);
    public Optional<Torneo> findBySede(Optional<Sede> sede);
    public boolean existsByNombre(String nombre);
    public boolean existsByFechaInicioAndFechaFinal(LocalDate fechaInicio, LocalDate fechaFinal);
    public boolean existsBySedeAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(Sede sede, LocalDate fechaFinal, LocalDate fechaInicio);
}
