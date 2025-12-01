package com.Robotech.BackEnd_Robotech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CompetidorDTO {
    private int id;
    private String apodo;
    private String nombres;
    private String correo;
    private String rol;
    private String dni;
    private String foto;
    private String estado;
}
