import { useState, useEffect } from "react";
import { useTurnos } from "../context/TurnosContext";
import {
  getDisponibilidad,
  crearDisponibilidad,
  eliminarDisponibilidad,
  actualizarDisponibilidad,
  getSlots,
} from "../services/api";

// Lunes a Domingo (orden visual)
const DIAS = [
  { label: "Lun", labelFull: "Lunes",      value: 1 },
  { label: "Mar", labelFull: "Martes",     value: 2 },
  { label: "Mié", labelFull: "Miércoles",  value: 3 },
  { label: "Jue", labelFull: "Jueves",     value: 4 },
  { label: "Vie", labelFull: "Viernes",    value: 5 },
  { label: "Sáb", labelFull: "Sábado",     value: 6 },
  { label: "Dom", labelFull: "Domingo",    value: 0 },
];

const DURACIONES = [
  { label: "30 min",  value: 30  },
  { label: "45 min",  value: 45  },
  { label: "1 hora",  value: 60  },
  { label: "1h 30m",  value: 90  },
  { label: "2 horas", value: 120 },
];

// Rango visible en la barra de tiempo
const HORA_MIN = 7;   // 07:00
const HORA_MAX = 22;  // 22:00
const RANGO   = HORA_MAX - HORA_MIN; // 15 horas

function toMinutos(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Posición y ancho dentro de la barra (porcentaje)
function barPosition(horaInicio, horaFin) {
  const ini = toMinutos(horaInicio) / 60;
  const fin = toMinutos(horaFin)   / 60;
  const left  = Math.max(0, ((ini - HORA_MIN) / RANGO) * 100);
  const width = Math.min(100 - left, ((fin - ini) / RANGO) * 100);
  return { left: `${left}%`, width: `${width}%` };
}

function calcularSlots(regla) {
  const inicioMin = toMinutos(regla.hora_inicio);
  const finMin    = toMinutos(regla.hora_fin) - regla.duracion_minutos;
  const slotsPorDia = Math.max(0, Math.floor((finMin - inicioMin) / regla.duracion_minutos) + 1);
  let dias = 0;
  const hoy = new Date();
  for (let i = 0; i < 28; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() === regla.dia_semana) dias++;
  }
  return slotsPorDia * dias;
}

// Marcas de hora para el eje
const MARCAS = [8, 10, 12, 14, 16, 18, 20];

export default function DisponibilidadSemanal() {
  const { token } = useTurnos();
  const [reglas, setReglas]               = useState([]);
  const [totalSlots, setTotalSlots]       = useState(null);
  const [cargando, setCargando]           = useState(true);
  const [cargandoAccion, setCargandoAccion] = useState(null);
  const [diaFormAbierto, setDiaFormAbierto] = useState(null); // valor de dia_semana
  const [error, setError]                 = useState("");
  const [form, setForm] = useState({
    hora_inicio: "15:00",
    hora_fin: "20:00",
    duracion_minutos: 60,
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    setCargando(true);
    const [dataReglas, dataSlots] = await Promise.all([
      getDisponibilidad(token),
      getSlots(),
    ]);
    setReglas(Array.isArray(dataReglas) ? dataReglas : []);
    setTotalSlots(Array.isArray(dataSlots) ? dataSlots.length : null);
    setCargando(false);
  }

  async function handleAgregar(e) {
    e.preventDefault();
    setError("");
    if (form.hora_fin <= form.hora_inicio) {
      setError("La hora de fin debe ser posterior a la de inicio.");
      return;
    }
    setCargandoAccion("agregar");
    const res = await crearDisponibilidad(
      {
        dia_semana:       diaFormAbierto,
        hora_inicio:      form.hora_inicio,
        hora_fin:         form.hora_fin,
        duracion_minutos: parseInt(form.duracion_minutos),
      },
      token
    );
    setCargandoAccion(null);
    if (res.error) { setError(res.error); return; }
    setDiaFormAbierto(null);
    setForm({ hora_inicio: "15:00", hora_fin: "20:00", duracion_minutos: 60 });
    await cargarTodo();
  }

  async function handleEliminar(id) {
    setCargandoAccion(`del-${id}`);
    await eliminarDisponibilidad(id, token);
    await cargarTodo();
    setCargandoAccion(null);
  }

  async function handleToggle(regla) {
    setCargandoAccion(`tog-${regla.id}`);
    await actualizarDisponibilidad(regla.id, { activa: !regla.activa }, token);
    await cargarTodo();
    setCargandoAccion(null);
  }

  const reglasPorDia = (diaVal) => reglas.filter(r => r.dia_semana === diaVal);
  const totalSlotsReglas = reglas.filter(r => r.activa).reduce((s, r) => s + calcularSlots(r), 0);

  if (cargando) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
        <p className="text-sm text-gray-400">Cargando disponibilidad...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Header con stats ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-800">Disponibilidad semanal</h3>
          <span className="text-xs text-gray-400">Próximas 4 semanas</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Definí qué días y horarios estás disponible. Los turnos se generan automáticamente.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{totalSlotsReglas}</p>
            <p className="text-xs text-gray-400 mt-0.5">Slots disponibles</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-500">
              {reglas.filter(r => r.activa).length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Reglas activas</p>
          </div>
        </div>
      </div>

      {/* ── Grilla semanal ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

        {/* Eje de horas */}
        <div className="flex border-b border-gray-50 px-4 pt-3 pb-1">
          <div className="w-16 shrink-0" />
          <div className="flex-1 relative h-4">
            {MARCAS.map(h => (
              <span
                key={h}
                className="absolute text-[10px] text-gray-300 -translate-x-1/2"
                style={{ left: `${((h - HORA_MIN) / RANGO) * 100}%` }}
              >
                {h}h
              </span>
            ))}
          </div>
          <div className="w-24 shrink-0" />
        </div>

        {/* Filas por día */}
        <div className="divide-y divide-gray-50">
          {DIAS.map(dia => {
            const reglasDelDia = reglasPorDia(dia.value);
            const formAbierto  = diaFormAbierto === dia.value;

            return (
              <div key={dia.value}>
                {/* Fila del día */}
                <div className="flex items-center gap-3 px-4 py-3 group">

                  {/* Nombre del día */}
                  <div className="w-16 shrink-0">
                    <span className={`text-sm font-medium ${reglasDelDia.length ? "text-gray-700" : "text-gray-300"}`}>
                      {dia.labelFull}
                    </span>
                  </div>

                  {/* Barra de tiempo */}
                  <div className="flex-1 relative h-8 bg-gray-50 rounded-lg overflow-hidden">
                    {/* Líneas de referencia */}
                    {MARCAS.map(h => (
                      <div
                        key={h}
                        className="absolute top-0 h-full border-l border-gray-100"
                        style={{ left: `${((h - HORA_MIN) / RANGO) * 100}%` }}
                      />
                    ))}

                    {reglasDelDia.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-gray-300">Sin disponibilidad</span>
                      </div>
                    )}

                    {reglasDelDia.map(r => {
                      const { left, width } = barPosition(r.hora_inicio, r.hora_fin);
                      const slots = calcularSlots(r);
                      return (
                        <div
                          key={r.id}
                          className={`absolute top-1 bottom-1 rounded-md flex items-center justify-center transition-opacity ${
                            r.activa
                              ? "bg-blue-400"
                              : "bg-gray-300 opacity-50"
                          }`}
                          style={{ left, width }}
                          title={`${r.hora_inicio.slice(0,5)}–${r.hora_fin.slice(0,5)} · ${r.duracion_minutos}min · ${slots} slots`}
                        >
                          <span className="text-[10px] text-white font-medium truncate px-1">
                            {r.hora_inicio.slice(0,5)}–{r.hora_fin.slice(0,5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Acciones */}
                  <div className="w-24 shrink-0 flex items-center justify-end gap-1">
                    {reglasDelDia.map(r => (
                      <div key={r.id} className="flex gap-1">
                        <button
                          onClick={() => handleToggle(r)}
                          disabled={!!cargandoAccion}
                          title={r.activa ? "Pausar" : "Activar"}
                          className={`text-[10px] px-1.5 py-1 rounded border transition disabled:opacity-40 ${
                            r.activa
                              ? "border-amber-200 text-amber-500 hover:bg-amber-50"
                              : "border-green-200 text-green-500 hover:bg-green-50"
                          }`}
                        >
                          {cargandoAccion === `tog-${r.id}` ? "·" : r.activa ? "⏸" : "▶"}
                        </button>
                        <button
                          onClick={() => handleEliminar(r.id)}
                          disabled={!!cargandoAccion}
                          title="Eliminar"
                          className="text-[10px] px-1.5 py-1 rounded border border-red-100 text-red-400 hover:bg-red-50 transition disabled:opacity-40"
                        >
                          {cargandoAccion === `del-${r.id}` ? "·" : "×"}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setDiaFormAbierto(formAbierto ? null : dia.value);
                        setError("");
                      }}
                      className="text-[10px] px-1.5 py-1 rounded border border-blue-200 text-blue-400 hover:bg-blue-50 transition"
                      title="Agregar regla"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Formulario inline para este día */}
                {formAbierto && (
                  <form
                    onSubmit={handleAgregar}
                    className="mx-4 mb-3 bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3"
                  >
                    <p className="text-xs font-medium text-blue-700">
                      Nueva regla para {dia.labelFull}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Desde</label>
                        <input
                          type="time"
                          value={form.hora_inicio}
                          onChange={e => setForm({ ...form, hora_inicio: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                        <input
                          type="time"
                          value={form.hora_fin}
                          onChange={e => setForm({ ...form, hora_fin: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Duración</label>
                        <select
                          value={form.duracion_minutos}
                          onChange={e => setForm({ ...form, duracion_minutos: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                        >
                          {DURACIONES.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!!cargandoAccion}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 rounded-lg transition disabled:opacity-40"
                      >
                        {cargandoAccion === "agregar" ? "Guardando..." : "Guardar regla"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDiaFormAbierto(null); setError(""); }}
                        className="px-4 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Hacé click en <span className="font-medium text-blue-400">+</span> en cualquier día para agregar disponibilidad. Los turnos ya confirmados no se ven afectados al modificar las reglas.
          </p>
        </div>
      </div>

    </div>
  );
}
