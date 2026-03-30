import { useState, useEffect } from "react";
import { useTurnos } from "../context/TurnosContext";
import { getTodasResenas, aprobarResena, eliminarResena } from "../services/api";
import GeneradorHorarios from "../components/GeneradorHorarios";


export default function AdminPage() {
  const { turnos, horarios, stats, token, agregarHorario, eliminarHorario, cancelarTurno, reprogramarTurno, logout } = useTurnos();
  const [form, setForm] = useState({ fecha: "", hora: "" });
  const [vista, setVista] = useState("dashboard");
  const [mensajeError, setMensajeError] = useState("");
  const [resenas, setResenas] = useState([]);
  const [mostrarGenerador, setMostrarGenerador] = useState(false);

  useEffect(() => {
    if (token) cargarResenas();
  }, [token]);

  async function cargarResenas() {
    const data = await getTodasResenas(token);
    setResenas(Array.isArray(data) ? data : []);
  }

  async function handleAprobarResena(id) {
    await aprobarResena(id, token);
    await cargarResenas();
  }

  async function handleEliminarResena(id) {
    await eliminarResena(id, token);
    await cargarResenas();
  }

  async function handleAgregarHorario(e) {
    e.preventDefault();
    if (!form.fecha || !form.hora) return;
    await agregarHorario(form);
    setForm({ fecha: "", hora: "" });
  }

  async function handleCancelar(id) {
    setMensajeError("");
    const res = await cancelarTurno(id);
    if (res?.error) setMensajeError(res.error);
  }

  async function handleReprogramar(id) {
    setMensajeError("");
    const res = await reprogramarTurno(id);
    if (res?.error) setMensajeError(res.error);
  }

  function formatFecha(fecha) {
    const [year, month, day] = fecha.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  const confirmados = turnos.filter(t => t.estado === "confirmado");
  const cancelados = turnos.filter(t => t.estado === "cancelado");

  const estadoColor = {
    confirmado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Fiore</h1>
            <p className="text-gray-400 text-sm">Mates con Fiore — administración</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-blue-500 underline">Ver sitio</a>
            <button onClick={logout} className="text-sm text-red-400 hover:text-red-600 transition">
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["dashboard", "turnos", "horarios", "resenas"].map(v => (
            <button
              key={v}
              onClick={() => { setVista(v); setMensajeError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${vista === v ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
            >
              {v === "dashboard" ? "Dashboard" : v === "turnos" ? "Turnos" : v === "horarios" ? "Mis horarios" : "Reseñas"}
            </button>
          ))}
        </div>

        {mensajeError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-600 text-sm">{mensajeError}</p>
          </div>
        )}

        {vista === "resenas" && (
          <div className="space-y-3">
            {resenas.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm">No hay reseñas todavía.</p>
              </div>
            ) : (
              resenas.map(r => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <span key={i} className={i <= r.estrellas ? "text-amber-400" : "text-gray-200"}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">"{r.texto}"</p>
                      <p className="text-xs font-medium text-gray-800">{r.nombre}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${r.aprobada ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.aprobada ? "Aprobada" : "Pendiente"}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!r.aprobada && (
                      <button
                        onClick={() => handleAprobarResena(r.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded-lg transition"
                      >
                        Aprobar
                      </button>
                    )}
                    <button
                      onClick={() => handleEliminarResena(r.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm py-1.5 rounded-lg border border-red-100 transition"
                    >
                      Eliminar
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
              <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-blue-500">{stats?.clasesSemana ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Clases esta semana</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-emerald-500">{stats?.alumnosUnicos ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Alumnos únicos</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-purple-500">{turnos.filter(t => t.estado === "confirmado").length}</p>
                <p className="text-xs text-gray-400 mt-1">Turnos confirmados</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h2 className="font-bold text-gray-700 mb-4">Próximos turnos de hoy</h2>
              {!stats?.proximosDia?.length ? (
                <p className="text-sm text-gray-400 italic">No hay turnos para hoy.</p>
              ) : (
                <div className="space-y-3">
                  {stats.proximosDia.map(t => (
                    <div key={t.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-none last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{t.nombre}</p>
                        <p className="text-xs text-gray-400">{t.nivel} · {t.hora?.slice(0, 5)} hs</p>
                      </div>
                      {t.whatsapp && (
                        <a
                          href={"https://wa.me/54" + t.whatsapp}
                          target="_blank"
                          className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full hover:bg-emerald-100 transition"
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
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm">No hay turnos todavía.</p>
              </div>
            ) : (
              turnos.map(t => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-800">{t.nombre}</p>
                      <p className="text-sm text-gray-400">{t.email} · {t.nivel}</p>
                      {t.whatsapp && (
                        <a
                          href={`https://wa.me/54${t.whatsapp}`}
                          target="_blank"
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          WA: {t.whatsapp}
                        </a>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {formatFecha(t.fecha)} — {t.hora?.slice(0, 5)} hs
                      </p>
                      {t.reprogramado && (
                        <span className="text-xs text-amber-500">Reprogramado</span>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColor[t.estado] || "bg-gray-100 text-gray-500"}`}>
                      {t.estado}
                    </span>
                  </div>
                  {t.estado === "confirmado" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleReprogramar(t.id)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 text-sm py-1.5 rounded-lg transition border border-amber-100"
                      >
                        Reprogramar
                      </button>
                      <button
                        onClick={() => handleCancelar(t.id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm py-1.5 rounded-lg transition border border-red-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {vista === "horarios" && (
          <div className="space-y-4">

            <button
              onClick={() => setMostrarGenerador(!mostrarGenerador)}
              className="w-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium py-2.5 rounded-xl transition"
            >
              {mostrarGenerador ? "Ocultar generador automático" : "Generar horarios automáticamente"}
            </button>

            {mostrarGenerador && (
              <GeneradorHorarios onCerrar={() => setMostrarGenerador(false)} />
            )}

            <form onSubmit={handleAgregarHorario} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
                <input
                  type="time"
                  value={form.hora}
                  onChange={e => setForm({ ...form, hora: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Agregar
              </button>
            </form>

            <div className="space-y-2">
              {horarios.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                  <p className="text-gray-400 text-sm">No hay horarios cargados.</p>
                </div>
              ) : (
                horarios.map(h => (
                  <div key={h.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      {formatFecha(h.fecha)} — {h.hora.slice(0, 5)} hs
                    </p>
                    <button
                      onClick={() => eliminarHorario(h.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}