package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "competidores", uniqueConstraints = {
        @UniqueConstraint(columnNames = "apodo")
})
public class Competidor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String apodo;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id",columnDefinition = "INT")
    private Usuario usuario;

    public Competidor(String apodo, Usuario usuario){
        this.apodo = apodo;
        this.usuario = usuario;
    }
}
