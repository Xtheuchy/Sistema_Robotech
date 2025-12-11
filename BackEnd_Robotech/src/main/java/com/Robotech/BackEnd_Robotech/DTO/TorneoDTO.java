package com.Robotech.BackEnd_Robotech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class TorneoDTO {
    private int id;
    private String nombreTorneo;
    private String descripcionTorneo;
    private String fotoTorneo;
    private int cantidadParticipantes;
    private LocalDate fechaInicio;
    private LocalDate fechaFinal;
    private String estado;
    private LocalDate creadoEn;
    //Categoria
    private String nombreCategoria;
    private String descripcionCategoria;
    //Sede
    private String nombreSede;
    private String direccionSede;
    //Juez
    private String nombreJuez;
    private String correoJuez;
}
