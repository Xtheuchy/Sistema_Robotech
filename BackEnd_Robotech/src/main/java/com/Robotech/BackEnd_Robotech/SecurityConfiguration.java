package com.Robotech.BackEnd_Robotech;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    // 1. Configuración del Password Encoder
    // ESTO SE QUEDA. Esta es la "herramienta" que tus servicios usarán para encriptar.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. ELIMINAMOS el UserDetailsService en memoria.
    // No lo necesitas si tu API va a ser pública y
    // gestionarás los usuarios desde un controlador.
    /*
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        // ... (código de usuario en memoria eliminado)
    }
    */

    // 3. Configuración de la Cadena de Filtros HTTP (¡AQUÍ ESTÁ EL CAMBIO!)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitamos CSRF para APIs REST
                .authorizeHttpRequests(auth -> auth
                        // ESTA LÍNEA HACE TODA TU API PÚBLICA Y ACCESIBLE
                        .anyRequest().permitAll()
                );
        // Ya no necesitamos .httpBasic() ni .formLogin() si todo es público

        return http.build();
    }
}