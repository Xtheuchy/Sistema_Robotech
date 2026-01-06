package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "Categorias")
public class Categoria{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    private int peso_min;
    private int peso_max;

    private String habilidad;

    public Categoria(String nombre, String descripcion, int peso_max, int peso_min, String habilidad){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.peso_max = peso_max;
        this.peso_min = peso_min;
        this.habilidad = habilidad;
    }
}
