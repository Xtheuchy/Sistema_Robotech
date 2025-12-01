package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "enfrentamientos")
public class Enfrentamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "torneo_id", nullable = false, columnDefinition = "INT")
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "competidor1_id", nullable = true, columnDefinition = "INT")
    private Competidor competidor1;

    @ManyToOne
    @JoinColumn(name = "competidor2_id", nullable = true, columnDefinition = "INT")
    private Competidor competidor2;

    private int puntaje_1;
    private int puntaje_2;

    private String estado;

    @ManyToOne
    @JoinColumn(name = "ganador", nullable = true, columnDefinition = "INT")
    private Competidor ganador;

    private int ronda;
}
