package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.IRolRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.IUsuarioRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UsuarioServiceImp implements IUsuarioServicio {
    // Inyección de dependencias
    private final IUsuarioRepositorio usuarioRepositorio;
    private final IRolRepositorio rolRepositorio;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UsuarioServiceImp(IUsuarioRepositorio usuarioRepositorio, IRolRepositorio rolRepositorio, PasswordEncoder passwordEncoder) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.rolRepositorio = rolRepositorio;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public List<Usuario> listarUsuarios() throws Exception{
        return usuarioRepositorio.findAll();
    }
    @Override
    public Usuario agregarUsuario(Usuario usuario) throws Exception{
        // 1. Validaciones: Verificar si ya existe un correo o DNI.
        if (usuarioRepositorio.existsByCorreo(usuario.getCorreo())) {
            throw new Exception("Error: El correo electrónico '" + usuario.getCorreo() + "' ya está en uso.");
        }
        if (usuarioRepositorio.existsByDni(usuario.getDni())) {
            throw new Exception("Error: El DNI '" + usuario.getDni() + "' ya está registrado.");
        }
        boolean correoValidado = validarCorreo(usuario.getCorreo());
        boolean passwordValidado = validarPassword(usuario.getPassword());
        boolean dniValidado = validarDni(usuario.getDni());
        if (correoValidado && passwordValidado && dniValidado) {
            // 2. Encriptar la contraseña
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            // 3. Guardar el usuario en la base de datos
            return usuarioRepositorio.save(usuario);
        } else {
            StringBuilder mensajeError = new StringBuilder();

            if (!correoValidado) {
                mensajeError.append("El correo debe terminar con '@robotech.com'.\n");
            }
            if (!passwordValidado) {
                mensajeError.append("La contraseña debe tener al menos 8 caracteres, contener letras mayúsculas, minúsculas, números y caracteres especiales.\n");
            }
            if (!dniValidado) {
                mensajeError.append("El DNI debe tener exactamente 8 caracteres numéricos.\n");
            }

            // Lanza una excepción con el mensaje de error acumulado
            throw new Exception(mensajeError.toString());
        }
    }
    @Override
    public Usuario obtenerUsuarioPorId(Integer id) throws Exception {
        return usuarioRepositorio.findById(id)
                .orElseThrow(() -> new Exception("Usuario no encontrado con ID: " + id));
    }
    @Override
    public void eliminarUsuario(Integer id) throws Exception {
        // Buscamos para verificar la existencia antes de eliminar
        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new Exception("Usuario no encontrado con ID: " + id));
        usuarioRepositorio.delete(usuario);
    }
    @Override
    public Usuario actualizarUsuario(Integer id, Usuario usuarioActualizado) throws Exception {
        // 1. Buscar al usuario existente en la BD
        // Usamos .orElseThrow() para detenernos aquí si el ID no existe.
        Usuario usuarioExistente = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new Exception("Usuario no encontrado con ID: " + id));
        // 2. Manejo de la Contraseña
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
        }

        // 3. Validar Duplicados Correo
        Optional<Usuario> usuarioPorCorreo = usuarioRepositorio.findByCorreo(usuarioActualizado.getCorreo());
        if (usuarioPorCorreo.isPresent() && usuarioPorCorreo.get().getId() != id) {
            throw new Exception("Error: El correo '" + usuarioActualizado.getCorreo() + "' ya está en uso por otro usuario.");
        }
        // 4. Validar Duplicados DNI
        Optional<Usuario> usuarioPorDni = usuarioRepositorio.findByDni(usuarioActualizado.getDni());
        if (usuarioPorDni.isPresent() && usuarioPorDni.get().getId() != id) {
            throw new Exception("Error: El DNI '" + usuarioActualizado.getDni() + "' ya está registrado por otro usuario.");
        }
        // 5. Actualizar el resto de los campos
        usuarioExistente.setNombres(usuarioActualizado.getNombres());
        usuarioExistente.setCorreo(usuarioActualizado.getCorreo());
        usuarioExistente.setDni(usuarioActualizado.getDni());
        usuarioExistente.setFoto(usuarioActualizado.getFoto());

        // 6. Actualizar el Rol
        Rol rolEntidad = usuarioActualizado.getRol();
        if (rolEntidad == null || rolEntidad.getId() == 0) {
            throw new Exception("Error: Debe proporcionar un ID de rol válido (1, 2 o 3).");
        }
        Rol rolBD = rolRepositorio.findById(rolEntidad.getId())
                .orElseThrow(() -> new Exception("Error: El ID de Rol " + rolEntidad.getId() + " no existe."));
        // Asigna el nuevo rol
        usuarioExistente.setRol(rolBD);
        boolean validado = validarCorreo(usuarioExistente.getCorreo());
        if (validado){
            // 7. Guardar la entidad actualizada en la BD
            return usuarioRepositorio.save(usuarioExistente);
        }else {
            throw  new Exception("El correo debe terminar con '@robotech.com'.");
        }
    }

    @Override
    public Usuario obtenerUsuarioPorCorreo(String correo) throws Exception {
        return usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new Exception("Correo no encontrado : "+ correo));
    }

    @Override
    public boolean verificarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    @Override
    public boolean validarCorreo(String correo) {
        String patron = "^[A-Za-z0-9._%+-]+@robotech\\.com$";
        return correo!=null && correo.matches(patron);
    }

    @Override
    public List<Usuario> listarAdministradoryJuez() throws Exception {
        List<String> roles = Arrays.asList("Administrador", "Juez");
        return usuarioRepositorio.findUsuariosByRol(roles);
    }

    @Override
    public boolean validarPassword(String password) throws Exception {
        // Expresión regular para validar los requisitos de la contraseña
        String regex = "^(?=.*[0-9])"         // Debe contener al menos un número
                + "(?=.*[a-z])"        // Debe contener al menos una letra minúscula
                + "(?=.*[A-Z])"        // Debe contener al menos una letra mayúscula
                + "(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])" // Debe contener al menos un carácter especial
                + ".{8,16}$";          // Longitud de 8 a 16 caracteres

        // Crear el patrón con la expresión regular
        Pattern pattern = Pattern.compile(regex);

        // Validar la contraseña
        Matcher matcher = pattern.matcher(password);

        // Retornar verdadero si la contraseña cumple con la expresión regular
        return matcher.matches();
    }

    @Override
    public boolean validarDni(String dni) {
        if (dni != null && dni.length() == 8) {
            return true;  // El DNI es válido
        }
        return false;  // El DNI no es válido
    }

}
