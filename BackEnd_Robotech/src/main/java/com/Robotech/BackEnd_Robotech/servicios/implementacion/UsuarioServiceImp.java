package com.Robotech.BackEnd_Robotech.servicios.implementacion;

import com.Robotech.BackEnd_Robotech.modelo.Rol;
import com.Robotech.BackEnd_Robotech.modelo.Usuario;
import com.Robotech.BackEnd_Robotech.repositorio.IRolRepositorio;
import com.Robotech.BackEnd_Robotech.repositorio.IUsuarioRepositorio;
import com.Robotech.BackEnd_Robotech.servicios.interfaz.IUsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        // 1. Validaciones: Verificar si ya existe un nombre, correo o DNI.
        if (usuarioRepositorio.existsByNombres(usuario.getNombres())) {
            throw new Exception("Error: El nombre de usuario '" + usuario.getNombres() + "' ya está en uso.");
        }
        if (usuarioRepositorio.existsByCorreo(usuario.getCorreo())) {
            throw new Exception("Error: El correo electrónico '" + usuario.getCorreo() + "' ya está en uso.");
        }
        if (usuarioRepositorio.existsByDni(usuario.getDni())) {
            throw new Exception("Error: El DNI '" + usuario.getDni() + "' ya está registrado.");
        }
        // 2. Encriptar la contraseña
        // Se toma la contraseña en texto plano y se reemplaza por el hash
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 3. Asignar el Rol
        Rol rolEntidad = usuario.getRol();
        if (rolEntidad == null || rolEntidad.getId() == 0) {
            throw new Exception("Error: Debe proporcionar un ID de rol válido (1, 2 o 3).");
        }
        Optional<Rol> rolBD = rolRepositorio.findById(rolEntidad.getId());
        if (rolBD.isEmpty()) {
            throw new Exception("Error: El ID de Rol " + rolEntidad.getId() + " no existe en la base de datos.");
        }
        // Reemplazamos el Rol simple (solo ID) que vino del JSON por la entidad Rol completa de la BD.
        usuario.setRol(rolBD.get());

        // 4. Guardar el usuario en la base de datos
        return usuarioRepositorio.save(usuario);
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
            // Caso A: El usuario envió una NUEVA contraseña. La encriptamos.
            usuarioExistente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
        }
        // Caso B: El usuario NO envió una contraseña (password es null o vacío).
        // No hacemos nada, y se conserva la contraseña encriptada que ya estaba.

        // 3. Validar Duplicados (Nombres)
        // Revisamos si el nuevo nombre ya existe Y si pertenece a un ID DIFERENTE al nuestro.
        Optional<Usuario> usuarioPorNombre = usuarioRepositorio.findByNombres(usuarioActualizado.getNombres());
        if (usuarioPorNombre.isPresent() && usuarioPorNombre.get().getId() != id) {
            throw new Exception("Error: El nombre de usuario '" + usuarioActualizado.getNombres() + "' ya está en uso por otro usuario.");
        }

        // 4. Validar Duplicados (Correo)
        Optional<Usuario> usuarioPorCorreo = usuarioRepositorio.findByCorreo(usuarioActualizado.getCorreo());
        if (usuarioPorCorreo.isPresent() && usuarioPorCorreo.get().getId() != id) {
            throw new Exception("Error: El correo '" + usuarioActualizado.getCorreo() + "' ya está en uso por otro usuario.");
        }
        // 5. Validar Duplicados (DNI)
        Optional<Usuario> usuarioPorDni = usuarioRepositorio.findByDni(usuarioActualizado.getDni());
        if (usuarioPorDni.isPresent() && usuarioPorDni.get().getId() != id) {
            throw new Exception("Error: El DNI '" + usuarioActualizado.getDni() + "' ya está registrado por otro usuario.");
        }
        // 6. Actualizar el resto de los campos
        usuarioExistente.setNombres(usuarioActualizado.getNombres());
        usuarioExistente.setCorreo(usuarioActualizado.getCorreo());
        usuarioExistente.setDni(usuarioActualizado.getDni());
        usuarioExistente.setFoto(usuarioActualizado.getFoto());

        // 7. Actualizar el Rol (Buscamos el rol por el ID enviado)
        Rol rolEntidad = usuarioActualizado.getRol();
        if (rolEntidad == null || rolEntidad.getId() == 0) {
            throw new Exception("Error: Debe proporcionar un ID de rol válido (1, 2 o 3).");
        }
        Rol rolBD = rolRepositorio.findById(rolEntidad.getId())
                .orElseThrow(() -> new Exception("Error: El ID de Rol " + rolEntidad.getId() + " no existe."));
        // Asigna el nuevo rol
        usuarioExistente.setRol(rolBD);
        // 8. Guardar la entidad actualizada en la BD
        return usuarioRepositorio.save(usuarioExistente);
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
}
