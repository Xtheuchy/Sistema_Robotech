package com.Robotech.BackEnd_Robotech.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnfrentamientoDTO {
    private int id;
    private int torneoId;
    private String c1_apodo;
    private String c1_foto;
    private String c2_apodo;
    private String c2_foto;
    private int puntaje1;
    private int puntaje2;
    private String apodoGanador;
    private String fotoGanador;
    private int ronda;
}
