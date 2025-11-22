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
    public Categoria(String nombre, String descripcion){
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}
