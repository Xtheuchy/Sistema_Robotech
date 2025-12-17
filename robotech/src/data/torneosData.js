import imagenSumo1 from "../assets/imagenes/sumo1.jpeg";
import imagenSumoExtremo from "../assets/imagenes/sumoextremo.jpg";
import imagenLaberintos from "../assets/imagenes/laberintos.jpeg";
import imagenRobotFutbol from "../assets/imagenes/futbol.jpg";
import imagenDrones from "../assets/imagenes/dron.png";
import imagenBatallaIA from "../assets/imagenes/batallaai.jpg";
import imagenRoboRally from "../assets/imagenes/roborally.jpg";
import imagenRescate from "../assets/imagenes/rescate.jpg";
import videoFondo from "../assets/video/video2.mp4"; // Importar video local

export const torneosData = [
    {
        id: "sumo-1",
        nombre: "Sumo1",
        categoriaRequerida: "Sumo",
        fecha: "2025-11-15",
        hora: "10:00 AM",
        duracion: "30 min",
        limite: 17,
        inscritos: 8,
        icono: "⚙️",
        descripcion: "Batallas 1vs1 entre robots pequeños y veloces en un dohyo. El objetivo es empujar al oponente fuera del ring.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenSumo1,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "sumo-extremo",
        nombre: "Sumo Extremo",
        categoriaRequerida: "Sumo Extremo",
        fecha: "2025-12-20",
        hora: "6:00 PM",
        duracion: "30 min",
        limite: 17,
        inscritos: 7,
        icono: "🤖",
        descripcion: "Robots grandes y potentes compiten por empujar al rival fuera de la arena. Se permite mayor peso y potencia.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenSumoExtremo,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "laberintos",
        nombre: "Laberintos de Robots",
        categoriaRequerida: "Laberintos",
        fecha: "2026-01-20",
        hora: "10:00 AM",
        duracion: "30 min",
        limite: 17,
        inscritos: 11,
        icono: "🧭",
        descripcion: "Robots autónomos deben encontrar la salida de un laberinto complejo en el menor tiempo posible.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenLaberintos,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "futbol",
        nombre: "Robot Fútbol",
        categoriaRequerida: "Fútbol",
        fecha: "2026-02-18",
        hora: "6:00 PM",
        duracion: "30 min",
        limite: 17,
        inscritos: 9,
        icono: "⚽🤖",
        descripcion: "Equipos de robots juegan partidos de fútbol adaptados. Cooperación y estrategia son clave.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenRobotFutbol,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "drones",
        nombre: "Carrera de Drones",
        categoriaRequerida: "Drones",
        fecha: "2026-03-10",
        hora: "10:00 AM",
        duracion: "30 min",
        limite: 17,
        inscritos: 5,
        icono: "🛸",
        descripcion: "Drones autónomos compiten en circuitos aéreos con obstáculos a alta velocidad.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenDrones,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "batalla-ia",
        nombre: "Batalla de IA",
        categoriaRequerida: "Batalla IA",
        fecha: "2026-04-05",
        hora: "6:00 PM",
        duracion: "30 min",
        limite: 17,
        inscritos: 14,
        icono: "🧠🤖",
        descripcion: "Robots virtuales o físicos usan IA avanzada para superar desafíos tácticos y estratégicos.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenBatallaIA,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "robo-rally",
        nombre: "Robo Rally",
        categoriaRequerida: "RoboRally",
        fecha: "2026-05-15",
        hora: "10:00 AM",
        duracion: "30 min",
        limite: 17,
        inscritos: 13,
        icono: "🏁🤖",
        descripcion: "Carrera de resistencia y velocidad para robots todoterreno en pistas difíciles.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenRoboRally,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
    {
        id: "rescate",
        nombre: "Rescate Robótico",
        categoriaRequerida: "Rescate",
        fecha: "2026-06-20",
        hora: "6:00 PM",
        duracion: "30 min",
        limite: 17,
        inscritos: 6,
        icono: "🚨🤖",
        descripcion: "Robots diseñados para búsqueda y rescate compiten en simulaciones de desastres.",
        premios: { primero: 500, segundo: 250, tercero: 150 },
        imagen: imagenRescate,
        videoBackground: videoFondo,
        isLocalVideo: true
    },
];
