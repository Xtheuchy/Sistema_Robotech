package com.Robotech.BackEnd_Robotech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubDTO {
    private int id;
    private int idPropietario;
    private String propietario;
    private String propietarioFoto;
    private String correo;
    private String telefono;
    private String clubNombre;
    private String direccion;
    private String logo;
    private String estado;
    private LocalDate Creado_en;
    private int puntos;

}
