package com.Robotech.BackEnd_Robotech.modelo.DTO;

import lombok.Data;

@Data
public class RegistroCompetidorDTO {
    private int id;
    private String apodo;
    private String codigoUnico;
    private String nombres;
    private String correo;
    private String dni;
    private String foto;
    private String password;
}
