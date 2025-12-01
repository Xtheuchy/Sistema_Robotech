package com.Robotech.BackEnd_Robotech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroDTO{
    private int id;
    private String nombres;
    private String correo;
    private String rol;
    private String dni;
    private String foto;
    private String password;
    private String estado;
}
