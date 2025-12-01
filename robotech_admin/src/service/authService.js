// src/service/authService.js

// URL API de Autenticación
const API_URL = "http://localhost:8080/auth";

export const login = async (credencialesDTO) => {
  const response = await fetch(`${API_URL}/login/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credencialesDTO),
  });

  if (!response.ok) {
    // se envia del backEnd un string como error,
    // así que usamos .text() en lugar de .json()
    const errorTexto = await response.text();

    // Lanzamos un error que será atrapado por el "catch" en LoginPage.jsx
    throw new Error(errorTexto || "Error de autenticación");
  }
  // Si la respuesta fue 200 OK, el backend nos devuelve el UsuarioDTO
  const usuarioDTO = await response.json();
  return usuarioDTO;
};
