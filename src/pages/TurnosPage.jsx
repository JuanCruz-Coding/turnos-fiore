import { useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTurnos } from "../context/TurnosContext";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";
import { getSlots, crearPreferenciaPago, crearOrdenPayPal, capturarOrdenPayPal } from "../services/api";

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
  const [pasoPayPal, setPasoPayPal] = useState(false);
  const horarioPayPalRef = useRef(null);
  const formPayPalRef = useRef(null);

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
    setPasoPayPal(false);
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

  async function handlePrepararPayPal() {
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
    setCargando(false);
    if (resTurno?.error) {
      setError(resTurno.error);
      return;
    }
    horarioPayPalRef.current = horarioSeleccionado;
    formPayPalRef.current = { ...form };
    setError("");
    setPasoPayPal(true);
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
  <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
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
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setPanelAbierto(false); setPasoPayPal(false); } }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-800 my-auto">

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
                    onClick={() => { setPanelAbierto(false); setPasoPayPal(false); }}
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

                    {!pasoPayPal && (
                      <>
                        {/* Mercado Pago */}
                        <button
                          type="button"
                          onClick={handlePagarMP}
                          disabled={cargando}
                          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.33c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.26 14.4l-2.95-.924c-.64-.203-.654-.64.136-.954l11.526-4.443c.537-.194 1.006.131.59.169z"/>
                          </svg>
                          Pagar con Mercado Pago
                        </button>

                        {/* PayPal */}
                        <button
                          type="button"
                          onClick={handlePrepararPayPal}
                          disabled={cargando}
                          className="w-full bg-[#FFC439] hover:bg-[#f0b72f] active:bg-[#e0aa2a] text-[#003087] font-bold py-2.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                          </svg>
                          PayPal
                        </button>

                        {/* Transferencia */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                          <span className="text-xs text-gray-400">o</span>
                          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                        </div>
                        <button
                          type="submit"
                          disabled={cargando}
                          className="w-full border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium py-2.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" />
                          </svg>
                          {cargando ? "Enviando..." : "Pagar por transferencia"}
                        </button>
                      </>
                    )}

                    {pasoPayPal && (
                      <div className="pt-1">
                        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-3">
                          Completá el pago con tu cuenta de PayPal
                        </p>
                        <PayPalButtons
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                          createOrder={async () => {
                            const data = await crearOrdenPayPal({
                              nombre: formPayPalRef.current.nombre,
                              email: formPayPalRef.current.email,
                              fecha: horarioPayPalRef.current.fecha,
                              hora: horarioPayPalRef.current.hora,
                            });
                            if (data?.error) throw new Error(data.error);
                            return data.orderID;
                          }}
                          onApprove={async (data) => {
                            setCargando(true);
                            const result = await capturarOrdenPayPal({ orderID: data.orderID });
                            setCargando(false);
                            if (result?.success) {
                              window.location.href = "/turnos/pago-exitoso";
                            } else {
                              setError("El pago no pudo completarse. Intentá de nuevo.");
                              setPasoPayPal(false);
                            }
                          }}
                          onError={() => {
                            setError("Ocurrió un error con PayPal. Intentá de nuevo.");
                            setPasoPayPal(false);
                          }}
                          onCancel={() => setPasoPayPal(false)}
                        />
                      </div>
                    )}
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  </PayPalScriptProvider>
  );
}
