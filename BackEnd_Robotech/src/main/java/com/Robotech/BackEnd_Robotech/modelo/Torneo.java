package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
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

    @ManyToOne
    @JoinColumn(name = "Juez", nullable = false, columnDefinition = "INT")
    private Usuario juez;

    private String nombre;
    private String descripcion;
    private String foto;
    private int cantidad;
    private LocalDate fechaInicio;
    private LocalDate fechaFinal;
    private String estado;
    @ManyToOne
    @JoinColumn(name = "sede_id", nullable = true, columnDefinition = "INT")
    private Sede sede;
    private LocalDate creado_en;

    public Torneo(String descripcion,Categoria categoria,String nombre,String foto,int cantidad,LocalDate fecha_inicio,LocalDate fecha_final,String estado,Sede sede){
        this.categoria = categoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.foto = foto;
        this.cantidad = cantidad;
        this.fechaInicio = fecha_inicio;
        this.fechaFinal = fecha_final;
        this.estado = estado;
        this.sede = sede;
    }

    public Torneo(Usuario juez,String descripcion,Categoria categoria,String nombre,String foto,int cantidad,LocalDate fecha_inicio,LocalDate fecha_final,String estado,Sede sede){
        this.categoria = categoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.foto = foto;
        this.cantidad = cantidad;
        this.fechaInicio = fecha_inicio;
        this.fechaFinal = fecha_final;
        this.estado = estado;
        this.sede = sede;
        this.juez = juez;
    }
}
