package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "identificadores")
public class Identificador {
    @Id
    private String id;
    @OneToOne
    @JoinColumn(name = "competidor_id", referencedColumnName = "id",columnDefinition = "INT")
    private Competidor competidor;

    @ManyToOne
    @JoinColumn(name = "club_id", referencedColumnName = "id")
    private Club club;

    //Constructor club
    public Identificador(Club club){
        this.club = club;
    }
}
