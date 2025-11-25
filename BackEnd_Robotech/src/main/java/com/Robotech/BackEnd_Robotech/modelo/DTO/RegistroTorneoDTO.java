package com.Robotech.BackEnd_Robotech.modelo.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class RegistroTorneoDTO {
    private int id;
    private String categoria;
    private String nombre_torneo;
    private String foto;
    private int cantidad;
    private LocalDate fecha_inicio;
    private LocalDate fecha_final;
    private String estado;
    private String sede;
}
