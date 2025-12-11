package com.Robotech.BackEnd_Robotech.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegistroTorneoDTO {
    private int id;
    private String categoria;
    private String nombre_torneo;
    private String descripcion_torneo;
    private String foto;
    private int cantidad;
    private LocalDate fecha_inicio;
    private LocalDate fecha_final;
    private String estado;
    private String sede;
    private String correoJuez;
}
