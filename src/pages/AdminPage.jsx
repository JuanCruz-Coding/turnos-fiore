import { useState, useEffect } from "react";
import { useTurnos } from "../context/TurnosContext";
import { getTodasResenas, aprobarResena, eliminarResena } from "../services/api";
import DisponibilidadSemanal from "../components/DisponibilidadSemanal";
import AlumnosPage from "./AlumnosPage";


export default function AdminPage() {
  const { turnos, stats, token, cancelarTurno, reprogramarTurno, confirmarPago, logout } = useTurnos();
  const [vista, setVista] = useState("dashboard");
  const [mensajeError, setMensajeError] = useState("");
  const [resenas, setResenas] = useState([]);
  const [cargandoAccion, setCargandoAccion] = useState(null);

  useEffect(() => {
    if (token) cargarResenas();
  }, [token]);

  async function handleConfirmarPago(id) {
    setCargandoAccion(`pago-${id}`);
    await confirmarPago(id);
    setCargandoAccion(null);
  }

  async function cargarResenas() {
    const data = await getTodasResenas(token);
    setResenas(Array.isArray(data) ? data : []);
  }

  async function handleAprobarResena(id) {
    setCargandoAccion(`aprobar-${id}`);
    await aprobarResena(id, token);
    await cargarResenas();
    setCargandoAccion(null);
  }

  async function handleEliminarResena(id) {
    setCargandoAccion(`eliminarResena-${id}`);
    await eliminarResena(id, token);
    await cargarResenas();
    setCargandoAccion(null);
  }

  async function handleCancelar(id) {
    setMensajeError("");
    setCargandoAccion(`cancelar-${id}`);
    const res = await cancelarTurno(id);
    if (res?.error) setMensajeError(res.error);
    setCargandoAccion(null);
  }

  async function handleReprogramar(id) {
    setMensajeError("");
    setCargandoAccion(`reprogramar-${id}`);
    const res = await reprogramarTurno(id);
    if (res?.error) setMensajeError(res.error);
    setCargandoAccion(null);
  }

  function formatFecha(fecha) {
    const [year, month, day] = fecha.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }

  const estadoColor = {
    confirmado: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    cancelado: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "turnos", label: "Turnos" },
    { id: "horarios", label: "Mis horarios" },
    { id: "alumnos", label: "Alumnos" },
    { id: "resenas", label: "Reseñas" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Fiore</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Mates con Fiore — administración</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200">Ver sitio</a>
            <button onClick={logout} className="text-sm text-red-400 hover:text-red-600 transition-colors duration-200">
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setVista(id); setMensajeError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                vista === id
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mensajeError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{mensajeError}</p>
          </div>
        )}

        {vista === "resenas" && (
          <div className="space-y-3">
            {resenas.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">No hay reseñas todavía.</p>
              </div>
            ) : (
              resenas.map(r => (
                <div key={r.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <span key={i} className={i <= r.estrellas ? "text-amber-400" : "text-gray-200 dark:text-gray-600"}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">"{r.texto}"</p>
                      <p className="text-xs font-medium text-gray-800 dark:text-white">{r.nombre}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${r.aprobada ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}>
                      {r.aprobada ? "Aprobada" : "Pendiente"}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!r.aprobada && (
                      <button
                        onClick={() => handleAprobarResena(r.id)}
                        disabled={!!cargandoAccion}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-40"
                      >
                        {cargandoAccion === `aprobar-${r.id}` ? "Aprobando..." : "Aprobar"}
                      </button>
                    )}
                    <button
                      onClick={() => handleEliminarResena(r.id)}
                      disabled={!!cargandoAccion}
                      className="flex-1 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 text-sm py-1.5 rounded-lg border border-red-100 dark:border-red-900 transition-colors duration-200 disabled:opacity-40"
                    >
                      {cargandoAccion === `eliminarResena-${r.id}` ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {vista === "dashboard" && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-blue-500">{stats?.clasesSemana ?? 0}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Clases esta semana</p>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-emerald-500">{stats?.alumnosUnicos ?? 0}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Alumnos únicos</p>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-purple-500">{turnos.filter(t => t.estado === "confirmado").length}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Turnos confirmados</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Próximos turnos de hoy</h2>
              {!stats?.proximosDia?.length ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">No hay turnos para hoy.</p>
              ) : (
                <div className="space-y-3">
                  {stats.proximosDia.map(t => (
                    <div key={t.id} className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-3 last:border-none last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white text-sm">{t.nombre}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t.nivel} · {t.hora?.slice(0, 5)} hs</p>
                      </div>
                      {t.whatsapp && (
                        <a
                          href={"https://wa.me/54" + t.whatsapp}
                          target="_blank"
                          className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors duration-200"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {vista === "turnos" && (
          <div className="space-y-3">
            {turnos.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">No hay turnos todavía.</p>
              </div>
            ) : (
              turnos.map(t => (
                <div key={t.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{t.nombre}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{t.email} · {t.nivel}</p>
                      {t.whatsapp && (
                        <a
                          href={`https://wa.me/54${t.whatsapp}`}
                          target="_blank"
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          WA: {t.whatsapp}
                        </a>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatFecha(t.fecha)} — {t.hora?.slice(0, 5)} hs
                      </p>
                      {t.reprogramado && (
                        <span className="text-xs text-amber-500 dark:text-amber-400">Reprogramado</span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColor[t.estado] || "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                        {t.estado}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${t.pago === "recibido" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}>
                        {t.pago === "recibido" ? "Pago recibido" : "Pago pendiente"}
                      </span>
                    </div>
                  </div>
                  {t.estado === "confirmado" && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {t.pago !== "recibido" && (
                        <button
                          onClick={() => handleConfirmarPago(t.id)}
                          disabled={!!cargandoAccion}
                          className="flex-1 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm py-1.5 rounded-lg transition-colors duration-200 border border-blue-100 dark:border-blue-900 disabled:opacity-40"
                        >
                          {cargandoAccion === `pago-${t.id}` ? "Confirmando..." : "Marcar pago recibido"}
                        </button>
                      )}
                      <button
                        onClick={() => handleReprogramar(t.id)}
                        disabled={!!cargandoAccion}
                        className="flex-1 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm py-1.5 rounded-lg transition-colors duration-200 border border-amber-100 dark:border-amber-900 disabled:opacity-40"
                      >
                        {cargandoAccion === `reprogramar-${t.id}` ? "Reprogramando..." : "Reprogramar"}
                      </button>
                      <button
                        onClick={() => handleCancelar(t.id)}
                        disabled={!!cargandoAccion}
                        className="flex-1 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 text-sm py-1.5 rounded-lg transition-colors duration-200 border border-red-100 dark:border-red-900 disabled:opacity-40"
                      >
                        {cargandoAccion === `cancelar-${t.id}` ? "Cancelando..." : "Cancelar"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {vista === "horarios" && (
          <DisponibilidadSemanal />
        )}

        {vista === "alumnos" && <AlumnosPage />}

      </div>
    </div>
  );
}
