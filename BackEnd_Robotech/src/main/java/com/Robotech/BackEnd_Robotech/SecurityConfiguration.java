package com.Robotech.BackEnd_Robotech;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder; // Necesario
import org.springframework.security.provisioning.InMemoryUserDetailsManager; // Necesario
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.core.userdetails.UserDetailsService; // Usaremos esta interfaz

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    // 1. Configuración del Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Debes seguir usando el PasswordEncoder
        return new BCryptPasswordEncoder();
    }

    // 2. Definición del UserDetailsService (Reemplazo del UserDetailsManager @Bean)
    // Spring Boot 3.x prefiere esta inyección para los usuarios en memoria
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {

        UserDetails user = User.builder()
                .username("miusuario")
                .password(passwordEncoder.encode("miclave123"))
                .roles("USER")
                .build();

        // Retornamos directamente una instancia de InMemoryUserDetailsManager
        // que implementa UserDetailsService.
        return new InMemoryUserDetailsManager(user);
    }

    // 3. Configuración de la Cadena de Filtros HTTP (Sin cambios)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults())
                .formLogin(form -> form.disable());

        return http.build();
    }
}