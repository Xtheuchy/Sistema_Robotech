package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "inscripciones")
public class Inscripcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "torneo_id", nullable = false, columnDefinition = "INT")
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "competidor_id", nullable = false, columnDefinition = "INT")
    private Competidor competidor;

    public Inscripcion(Torneo torneo, Competidor competidor){
        this.torneo = torneo;
        this.competidor = competidor;
    }

}
