import { useState, useEffect } from "react";
import { useTurnos } from "../context/TurnosContext";
import {
  getDisponibilidad,
  crearDisponibilidad,
  eliminarDisponibilidad,
  actualizarDisponibilidad,
} from "../services/api";

const DIAS = [
  { label: "Domingo", value: 0 },
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
];

const DURACIONES = [
  { label: "30 minutos", value: 30 },
  { label: "45 minutos", value: 45 },
  { label: "1 hora", value: 60 },
  { label: "1h 30min", value: 90 },
  { label: "2 horas", value: 120 },
];

export default function DisponibilidadSemanal({ onCerrar }) {
  const { token } = useTurnos();
  const [reglas, setReglas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoAccion, setCargandoAccion] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    dia_semana: 1,
    hora_inicio: "15:00",
    hora_fin: "20:00",
    duracion_minutos: 60,
  });

  useEffect(() => {
    cargarReglas();
  }, []);

  async function cargarReglas() {
    setCargando(true);
    const data = await getDisponibilidad(token);
    setReglas(Array.isArray(data) ? data : []);
    setCargando(false);
  }

  async function handleAgregar(e) {
    e.preventDefault();
    setError("");

    if (form.hora_fin <= form.hora_inicio) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setCargandoAccion("agregar");
    const res = await crearDisponibilidad(
      {
        dia_semana: parseInt(form.dia_semana),
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        duracion_minutos: parseInt(form.duracion_minutos),
      },
      token
    );
    setCargandoAccion(null);

    if (res.error) {
      setError(res.error);
      return;
    }
    await cargarReglas();
    setForm({ dia_semana: 1, hora_inicio: "15:00", hora_fin: "20:00", duracion_minutos: 60 });
  }

  async function handleEliminar(id) {
    setCargandoAccion(`eliminar-${id}`);
    await eliminarDisponibilidad(id, token);
    await cargarReglas();
    setCargandoAccion(null);
  }

  async function handleToggleActiva(regla) {
    setCargandoAccion(`toggle-${regla.id}`);
    await actualizarDisponibilidad(regla.id, { activa: !regla.activa }, token);
    await cargarReglas();
    setCargandoAccion(null);
  }

  function nombreDia(dia_semana) {
    return DIAS.find(d => d.value === dia_semana)?.label ?? dia_semana;
  }

  function formatHora(h) {
    return h?.slice(0, 5) ?? h;
  }

  // Calcula cuántos slots generaría una regla (próximos 28 días)
  function calcularSlotsRegla(regla) {
    const [hIni, mIni] = regla.hora_inicio.split(":").map(Number);
    const [hFin, mFin] = regla.hora_fin.split(":").map(Number);
    const inicioMin = hIni * 60 + mIni;
    const finMin = hFin * 60 + mFin - regla.duracion_minutos;
    const slotsPorDia = Math.max(0, Math.floor((finMin - inicioMin) / regla.duracion_minutos) + 1);

    // Contar cuántos días de ese dia_semana hay en los próximos 28 días
    let dias = 0;
    const hoy = new Date();
    for (let i = 0; i < 28; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      if (d.getDay() === regla.dia_semana) dias++;
    }
    return slotsPorDia * dias;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">Disponibilidad semanal</h3>
          <p className="text-xs text-gray-400 mt-0.5">Los slots se generan automáticamente para las próximas 4 semanas</p>
        </div>
        <button onClick={onCerrar} className="text-gray-300 hover:text-gray-500 text-xl transition">×</button>
      </div>

      {/* Lista de reglas existentes */}
      {cargando ? (
        <p className="text-sm text-gray-400 text-center py-4">Cargando reglas...</p>
      ) : reglas.length === 0 ? (
        <div className="bg-gray-50 rounded-xl px-4 py-6 text-center">
          <p className="text-sm text-gray-400">No hay reglas definidas todavía.</p>
          <p className="text-xs text-gray-300 mt-1">Agregá tu primera regla abajo.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reglas.map(r => (
            <div
              key={r.id}
              className={`border rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition ${r.activa ? "border-gray-100 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-sm">{nombreDia(r.dia_semana)}</span>
                  {!r.activa && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Pausada</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatHora(r.hora_inicio)} – {formatHora(r.hora_fin)} · {r.duracion_minutos} min/clase
                  {r.activa && (
                    <span className="text-blue-400 ml-2">~{calcularSlotsRegla(r)} slots en 4 sem.</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActiva(r)}
                  disabled={!!cargandoAccion}
                  title={r.activa ? "Pausar" : "Activar"}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition disabled:opacity-40 ${
                    r.activa
                      ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                      : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {cargandoAccion === `toggle-${r.id}` ? "..." : r.activa ? "Pausar" : "Activar"}
                </button>
                <button
                  onClick={() => handleEliminar(r.id)}
                  disabled={!!cargandoAccion}
                  className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-40 px-2 py-1.5"
                >
                  {cargandoAccion === `eliminar-${r.id}` ? "..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar regla */}
      <form onSubmit={handleAgregar} className="border border-blue-100 bg-blue-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-medium text-blue-700">Agregar nueva regla</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Día</label>
            <select
              value={form.dia_semana}
              onChange={e => setForm({ ...form, dia_semana: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
            >
              {DIAS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Duración de clase</label>
            <select
              value={form.duracion_minutos}
              onChange={e => setForm({ ...form, duracion_minutos: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
            >
              {DURACIONES.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input
              type="time"
              value={form.hora_inicio}
              onChange={e => setForm({ ...form, hora_inicio: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
            <input
              type="time"
              value={form.hora_fin}
              onChange={e => setForm({ ...form, hora_fin: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!!cargandoAccion}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-40"
        >
          {cargandoAccion === "agregar" ? "Agregando..." : "+ Agregar regla"}
        </button>
      </form>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <p className="text-amber-700 text-xs">
          ⚠ Los slots se calculan en tiempo real. Podés pausar una regla temporalmente sin perder los turnos ya reservados.
        </p>
      </div>

    </div>
  );
}
