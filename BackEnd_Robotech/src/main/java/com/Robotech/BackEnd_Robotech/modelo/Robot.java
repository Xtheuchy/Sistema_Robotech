package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "robots")
public class Robot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String foto;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false, columnDefinition = "INT")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "competidor_id", nullable = false, columnDefinition = "INT")
    private Competidor competidor;

    public Robot(String nombre, String foto, Categoria categoria){
        this.nombre = nombre;
        this.foto = foto;
        this.categoria = categoria;
    }
}
