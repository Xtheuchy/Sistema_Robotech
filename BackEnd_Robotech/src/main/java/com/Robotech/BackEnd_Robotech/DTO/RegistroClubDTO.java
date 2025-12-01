package com.Robotech.BackEnd_Robotech.DTO;

import lombok.Data;

@Data
public class RegistroClubDTO {
    private int id;
    private String nombres;
    private String correo;
    private String dni;
    private String foto;
    private String password;
    private String nombreClub;
    private String direccion_fiscal;
    private String telefono;
    private String logo;
}
