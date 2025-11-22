package com.Robotech.BackEnd_Robotech.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(columnNames = "nombres"),
        @UniqueConstraint(columnNames = "correo"),
        @UniqueConstraint(columnNames = "dni")
})
@Data
public class Usuario {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int id;

     @ManyToOne
     @JoinColumn(name = "rol_id", nullable = false, columnDefinition = "INT") // Define la columna de clave foránea
     private Rol rol;

     @Column(nullable = false, length = 50)
     private String nombres;

     @Column(nullable = false, length = 100)
     private String correo;

     @Column(nullable = false, length = 60)
     private String password;

     @Column(nullable = false, length = 15)
     private String dni;

     @Column
     private String foto;

     @Column(nullable = false, length = 15)
     private String estado;

     public Usuario(String nombres, String correo, String dni, String password, Rol rol,String estado) {
        this.nombres = nombres;
        this.correo = correo;
        this.dni = dni;
        this.password = password;
        this.rol = rol;
        this.estado = estado;
     }
     // Constructor para registro CON foto
     public Usuario(String nombres, String correo, String dni, String password, String foto, Rol rol) {
        this.nombres = nombres;
        this.correo = correo;
        this.dni = dni;
        this.password = password;
        this.foto = foto;
        this.rol = rol;
     }
     //Constructor con todos los atributos
     public Usuario(String nombres, String correo, String dni, String password, String foto, Rol roldb, String estado) {
         this.nombres = nombres;
         this.correo = correo;
         this.dni = dni;
         this.password = password;
         this.foto = foto;
         this.rol = roldb;
         this.estado = estado;
     }
}
