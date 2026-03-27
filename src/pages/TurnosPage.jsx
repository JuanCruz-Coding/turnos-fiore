import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTurnos } from "../context/TurnosContext";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

export default function TurnosPage() {
  const { horarios, solicitarTurno } = useTurnos();
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "", nivel: "" });
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [vista, setVista] = useState("month");

  const eventos = horarios.map(h => ({
    id: h.id,
    title: `${h.hora.slice(0, 5)} hs`,
    start: new Date(`${h.fecha.split('T')[0]}T${h.hora}`),
    end: new Date(`${h.fecha.split('T')[0]}T${h.hora}`),
    resource: h,
  }));

  function handleSelectEvento(evento) {
    setHorarioSeleccionado(evento.resource);
    setPanelAbierto(true);
    setError("");
    setEnviado(false);
  }

  function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.whatsapp || !form.nivel) {
      setError("Completá todos los campos.");
      return;
    }
    setCargando(true);
    await solicitarTurno({
      nombre: form.nombre,
      email: form.email,
      whatsapp: form.whatsapp,
      nivel: form.nivel,
      horario_id: horarioSeleccionado.id,
      fecha: horarioSeleccionado.fecha,
      hora: horarioSeleccionado.hora,
    });
    setEnviado(true);
    setError("");
    setCargando(false);
    setForm({ nombre: "", email: "", nivel: "" });
  }

  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-blue-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Horarios disponibles</h1>
            <p className="text-gray-400">Hacé click en un turno disponible para reservarlo.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
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
          </div>

        </div>
      </main>

      {panelAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setPanelAbierto(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

            {enviado ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">¡Turno solicitado!</h2>
                <p className="text-gray-400 text-sm mb-6">Fiore va a confirmar tu turno a la brevedad.</p>
                <button
                  onClick={() => { setPanelAbierto(false); setEnviado(false); }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition"
                >
                  Volver al calendario
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Reservar clase</h2>
                    {horarioSeleccionado && (
                      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
                        <p className="text-xs text-blue-400 mb-0.5">Horario seleccionado</p>
                        <p className="text-sm font-medium text-blue-700 capitalize">
                          {formatFecha(horarioSeleccionado.fecha)}
                        </p>
                        <p className="text-sm text-blue-600">{horarioSeleccionado.hora.slice(0, 5)} hs</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setPanelAbierto(false)}
                    className="text-gray-300 hover:text-gray-500 text-2xl leading-none transition"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={form.nombre}
                      onChange={e => setForm({ ...form, nombre: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="Ej: 3415551234"
                      value={form.whatsapp}
                      onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                    <select
                      value={form.nivel}
                      onChange={e => setForm({ ...form, nivel: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                    >
                      <option value="">Seleccioná tu nivel</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Adultos">Adulto / otra situación</option>
                      <option value="Grupo">Quiero armar un grupo</option>
                    </select>
                  </div>

                  {form.horarioId && horarioSeleccionado && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                      <p className="text-xs text-blue-400 mb-0.5">Horario seleccionado</p>
                      <p className="text-sm font-medium text-blue-700 capitalize">
                        {formatFecha(horarioSeleccionado.fecha)} — {horarioSeleccionado.hora.slice(0, 5)} hs
                      </p>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-40"
                  >
                    {cargando ? "Enviando..." : "Confirmar turno"}
                  </button>
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