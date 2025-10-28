package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 25, unique = true, nullable = false)
    private String nombre;

    public Rol(String nombre){
        this.nombre = nombre;
    }
}
