package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "torneos")
public class Torneo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false, columnDefinition = "INT")
    private Categoria categoria;
    private String nombre;
    private String foto;
    private int cantidad;
    private LocalDate fechaInicio;
    private LocalDate fechaFinal;
    private String estado;
    @ManyToOne
    @JoinColumn(name = "sede_id", nullable = false, columnDefinition = "INT")
    private Sede sede;
    private LocalDate creado_en;

    public Torneo(Categoria categoria,String nombre,String foto,int cantidad,LocalDate fecha_inicio,LocalDate fecha_final,String estado,Sede sede){
        this.categoria = categoria;
        this.nombre = nombre;
        this.foto = foto;
        this.cantidad = cantidad;
        this.fechaInicio = fecha_inicio;
        this.fechaFinal = fecha_final;
        this.estado = estado;
        this.sede = sede;
    }
}
