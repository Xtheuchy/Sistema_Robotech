package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "sedes")
public class Sede {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombreSede;
    private String direccion;
    private int capacidad;

    public Sede(String nombreSede, String direccion, int capacidad){
        this.nombreSede = nombreSede;
        this.direccion = direccion;
        this.capacidad = capacidad;
    }


}
