// src/service/authService.js

// Asegúrate de que esta URL coincida con tu backend
// (Tu AuthController está en "/auth")
const API_URL = "http://localhost:8080/auth";

export const login = async (credencialesDTO) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credencialesDTO),
  });

  // --- Manejo de Respuesta ---
  // Si la respuesta NO fue 200 OK (ej. 401, 500)
  if (!response.ok) {
    // Tu backend envía un String (texto plano) como error,
    // así que usamos .text() en lugar de .json()
    const errorTexto = await response.text();

    // Lanzamos un error que será atrapado por el "catch" en LoginPage.jsx
    throw new Error(errorTexto || "Error de autenticación");
  }
  // Si la respuesta fue 200 OK, tu backend envía el UsuarioDTO
  const usuarioDTO = await response.json();
  return usuarioDTO;
};
