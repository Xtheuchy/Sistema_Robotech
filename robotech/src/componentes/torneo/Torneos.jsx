import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { torneosData } from "../../data/torneosData";

export default function Torneos() {
  const [search, setSearch] = useState("");

  const torneos = torneosData;

  const torneosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return torneos.filter(t => t.nombre.toLowerCase().includes(q));
  }, [search]);

  return (
    <section className="py-5 omega-about-bg omega-destello">
      <div className="container text-center">
        <h3 className="fw-bold mb-5 display-5 omega-title-upgraded">
          Próximos Torneos
        </h3>

        <div className="input-group mb-4 w-50 mx-auto">
          <span className="input-group-text">🔎</span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar torneo por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="row g-4">
          {torneosFiltrados.length > 0 ? torneosFiltrados.map((t, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="omega-card-upgraded h-100 overflow-hidden omega-border-cyan omega-destello">

                {/* IMAGEN */}
                <div className="overflow-hidden" style={{ height: "160px" }}>
                  <img
                    src={t.imagen}
                    alt={t.nombre}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>

                {/* CONTENIDO */}
                <div className="card-body d-flex flex-column text-center p-3">
                  <h5 className="fw-bold omega-text-card">{t.icono} {t.nombre}</h5>
                  <span className="badge rounded-pill mb-2" style={{ backgroundColor: "cyan", color: "black", fontWeight: "bold" }}>
                    {t.fecha} - {t.hora}
                  </span>
                  <p className="mb-2 omega-text-card">
                    <strong>{t.inscritos}/{t.limite}</strong> participantes
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-auto">
                    <button
                      className="btn btn-outline-info fw-bold rounded-pill omega-btn-neon"
                      data-bs-toggle="modal"
                      data-bs-target={`#modal${i}`}
                    >
                      INFORMACIÓN
                    </button>
                    <Link
                      to={`/sala/${t.id}`}
                      className="btn btn-success fw-bold rounded-pill omega-btn-neon"
                    >
                      INGRESAR
                    </Link>
                  </div>
                </div>
              </div>

              {/* MODAL */}
              <div className="modal fade" id={`modal${i}`} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content omega-card-upgraded p-2">
                    <div className="modal-header border-0">
                      <h5 className="modal-title fw-bold omega-text-card modal-title-large">{t.icono} {t.nombre}</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body text-start omega-text-card modal-text-large">
                      <img src={t.imagen} className="img-fluid mb-3 rounded-3 modal-img-small" alt={t.nombre} style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }} />
                      <p>{t.descripcion}</p>
                      <p><strong>Hora:</strong> {t.hora}</p>
                      <p><strong>Duración:</strong> {t.duracion}</p>
                      <p><strong>Premios:</strong></p>
                      <ul>
                        <li>1er lugar: {t.premios.primero} soles</li>
                        <li>2do lugar: {t.premios.segundo} soles</li>
                        <li>3er lugar: {t.premios.tercero} soles</li>
                      </ul>
                    </div>
                    <div className="modal-footer border-0">
                      <button className="btn btn-outline-light rounded-pill" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )) : (
            <div className="col-12">
              <div className="omega-card-upgraded p-4 text-center" style={{ background: "rgba(0,20,30,0.6)" }}>
                ❌ No se encontró ningún torneo con ese nombre.
              </div>
            </div>
          )}
        </div>
      </div>


    </section>
  );
}
