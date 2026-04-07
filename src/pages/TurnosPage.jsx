import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTurnos } from "../context/TurnosContext";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";
import { getSlots, crearPreferenciaPago } from "../services/api";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

export default function TurnosPage() {
  const { solicitarTurno } = useTurnos();
  const [slots, setSlots] = useState([]);
  const [cargandoSlots, setCargandoSlots] = useState(true);
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "", dni: "", nivel: "" });
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [vista, setVista] = useState("month");

  useEffect(() => {
    cargarSlots();
  }, []);

  async function cargarSlots() {
    setCargandoSlots(true);
    const data = await getSlots();
    setSlots(Array.isArray(data) ? data : []);
    setCargandoSlots(false);
  }

  const eventos = slots.map((s, idx) => ({
    id: idx,
    title: `${s.hora.slice(0, 5)} hs`,
    start: new Date(`${s.fecha}T${s.hora}`),
    end: new Date(`${s.fecha}T${s.hora}`),
    resource: s,
  }));

  function handleSelectEvento(evento) {
    setHorarioSeleccionado(evento.resource);
    setPanelAbierto(true);
    setError("");
    setEnviado(false);
  }

  function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-AR", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric"
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.whatsapp || !form.dni || !form.nivel) {
      setError("Completá todos los campos.");
      return;
    }
    setCargando(true);
    const res = await solicitarTurno({
      nombre: form.nombre,
      email: form.email,
      whatsapp: form.whatsapp,
      dni: form.dni,
      nivel: form.nivel,
      fecha: horarioSeleccionado.fecha,
      hora: horarioSeleccionado.hora,
    });
    setCargando(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    setEnviado(true);
    setError("");
    setForm({ nombre: "", email: "", whatsapp: "", dni: "", nivel: "" });
    cargarSlots();
  }

  async function handlePagarMP() {
    if (!form.nombre || !form.email || !form.whatsapp || !form.dni || !form.nivel) {
      setError("Completá todos los campos antes de pagar.");
      return;
    }
    setCargando(true);

    const resTurno = await solicitarTurno({
      nombre: form.nombre,
      email: form.email,
      whatsapp: form.whatsapp,
      dni: form.dni,
      nivel: form.nivel,
      fecha: horarioSeleccionado.fecha,
      hora: horarioSeleccionado.hora,
    });

    if (resTurno?.error) {
      setCargando(false);
      setError(resTurno.error);
      return;
    }

    const data = await crearPreferenciaPago({
      nombre: form.nombre,
      email: form.email,
      fecha: horarioSeleccionado.fecha,
      hora: horarioSeleccionado.hora,
    });

    setCargando(false);

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      setError("Error al conectar con Mercado Pago. Intentá por transferencia.");
    }
  }

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="dark:bg-gray-950">
      <Nav />
      <main className="min-h-screen bg-blue-50 dark:bg-gray-950 py-12 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Horarios disponibles</h1>
            <p className="text-gray-500 dark:text-gray-400">Hacé click en un turno disponible para reservarlo.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            {cargandoSlots ? (
              <div className="flex items-center justify-center" style={{ height: 600 }}>
                <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando horarios disponibles...</p>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleSelectEvento}
                views={["month", "week", "day"]}
                view={vista}
                onView={setVista}
                date={fecha}
                onNavigate={setFecha}
                culture="es"
                messages={{
                  next: "Siguiente",
                  previous: "Anterior",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  noEventsInRange: "No hay horarios disponibles.",
                }}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: "#3b82f6",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    padding: "2px 6px",
                  }
                })}
              />
            )}
          </div>

        </div>
      </main>

      {panelAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setPanelAbierto(false); }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-800">

            {enviado ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <svg className="w-14 h-14 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Turno solicitado!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Fiore va a confirmar tu turno a la brevedad.</p>
                <button
                  onClick={() => { setPanelAbierto(false); setEnviado(false); }}
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors duration-200"
                >
                  Volver al calendario
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reservar clase</h2>
                    {horarioSeleccionado && (
                      <div className="mt-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-2">
                        <p className="text-xs text-blue-400 mb-0.5">Horario seleccionado</p>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 capitalize">
                          {formatFecha(horarioSeleccionado.fecha)}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{horarioSeleccionado.hora.slice(0, 5)} hs</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setPanelAbierto(false)}
                    className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-2xl leading-none transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className={labelClass}>Nombre</label>
                    <input type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp</label>
                    <input type="tel" placeholder="Ej: 3415551234" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>DNI</label>
                    <input type="text" placeholder="Tu número de DNI" value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nivel</label>
                    <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })} className={inputClass}>
                      <option value="">Seleccioná tu nivel</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Adultos">Adulto / otra situación</option>
                      <option value="Grupo">Quiero armar un grupo</option>
                    </select>
                  </div>

                  {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handlePagarMP}
                      disabled={cargando}
                      className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <span>Pagar con Mercado Pago</span>
                      <span className="text-xs bg-blue-400 px-2 py-0.5 rounded-full">Recomendado</span>
                    </button>
                    <button
                      type="submit"
                      disabled={cargando}
                      className="w-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 font-medium py-2.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-40"
                    >
                      Pagar por transferencia
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
