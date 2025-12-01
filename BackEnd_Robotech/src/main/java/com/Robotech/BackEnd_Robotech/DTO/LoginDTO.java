package com.Robotech.BackEnd_Robotech.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginDTO{
    private String correo;
    private String password;
}
