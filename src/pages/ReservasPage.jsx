import { useState } from "react";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

const alias = "fiorellacozza.mp";
const whatsapp = "5493412140785";

function IconMP() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.33c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.26 14.4l-2.95-.924c-.64-.203-.654-.64.136-.954l11.526-4.443c.537-.194 1.006.131.59.169z"/>
    </svg>
  );
}

function IconPayPal() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
    </svg>
  );
}

function IconTransferencia() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" />
    </svg>
  );
}

export default function ReservasPage() {
  const [copiado, setCopiado] = useState(false);
  const [metodo, setMetodo] = useState(null); // "mp" | "paypal" | "transferencia"

  function copiarAlias() {
    navigator.clipboard.writeText(alias);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const metodos = [
    {
      id: "mp",
      label: "Mercado Pago",
      sub: "Pago online · ARS",
      Icon: IconMP,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
      bgActive: "bg-blue-100 dark:bg-blue-900/50 border-blue-400 dark:border-blue-500",
    },
    {
      id: "paypal",
      label: "PayPal",
      sub: "Pago online · USD",
      Icon: IconPayPal,
      color: "text-blue-700 dark:text-blue-300",
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
      bgActive: "bg-indigo-100 dark:bg-indigo-900/50 border-indigo-400 dark:border-indigo-500",
    },
    {
      id: "transferencia",
      label: "Transferencia",
      sub: "Manual · ARS",
      Icon: IconTransferencia,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      bgActive: "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-500",
    },
  ];

  const pasoNum = (n) => metodo === "transferencia" ? n : n > 2 ? n - 1 : n;
  const totalPasos = metodo === "transferencia" ? 4 : 3;

  return (
    <div className="dark:bg-gray-950">
      <Nav />
      <main className="min-h-screen bg-blue-50 dark:bg-gray-950 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-14">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">¿Cómo reservar una clase?</h1>
            <p className="text-gray-500 dark:text-gray-400">Seguí estos pasos simples y en minutos tenés tu clase confirmada.</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />

            <div className="space-y-6">

              {/* Paso 1 */}
              <div className="relative flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-sm">1</div>
                <div className="bg-white dark:bg-gray-800/60 border border-blue-100 dark:border-blue-900 rounded-2xl p-6 flex-1 hover:shadow-md transition-all duration-300">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Elegí tu horario</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    Entrá al calendario de disponibilidad y elegí el día y hora que mejor te quede.
                  </p>
                  <a
                    href="/turnos"
                    className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-200"
                  >
                    Ver disponibilidad
                  </a>
                </div>
              </div>

              {/* Paso 2 — elegir método de pago */}
              <div className="relative flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-sm">2</div>
                <div className="bg-white dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-6 flex-1 hover:shadow-md transition-all duration-300">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Elegí cómo pagar</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    Podés pagar online al instante o hacer una transferencia manual.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {metodos.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMetodo(m.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                          metodo === m.id ? m.bgActive : m.bg + " hover:opacity-80"
                        }`}
                      >
                        <span className={m.color}><m.Icon /></span>
                        <span className={`text-xs font-semibold ${m.color}`}>{m.label}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{m.sub}</span>
                      </button>
                    ))}
                  </div>

                  {metodo === "mp" && (
                    <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 flex items-start gap-3">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Al confirmar la reserva vas a poder pagar con Mercado Pago directamente desde el formulario. Tu turno queda confirmado al instante.
                      </p>
                    </div>
                  )}

                  {metodo === "paypal" && (
                    <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-3 flex items-start gap-3">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        Al confirmar la reserva vas a poder pagar con PayPal en dólares directamente desde el formulario. Tu turno queda confirmado al instante.
                      </p>
                    </div>
                  )}

                  {metodo === "transferencia" && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-xl px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-emerald-500 dark:text-emerald-400 mb-0.5">Alias Mercado Pago</p>
                        <p className="font-bold text-emerald-700 dark:text-emerald-300 text-lg tracking-wide">{alias}</p>
                      </div>
                      <button
                        onClick={copiarAlias}
                        className="text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors duration-200"
                      >
                        {copiado ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Paso 3 — solo si es transferencia */}
              {metodo === "transferencia" && (
                <div className="relative flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-violet-500 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-sm">3</div>
                  <div className="bg-white dark:bg-gray-800/60 border border-violet-100 dark:border-violet-900 rounded-2xl p-6 flex-1 hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Enviá el comprobante</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Mandá el comprobante de transferencia por WhatsApp junto con tu nombre y el horario reservado.
                    </p>
                    <a
                      href={"https://wa.me/" + whatsapp}
                      target="_blank"
                      className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-200"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* Paso final — A aprender */}
              <div className="relative flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                  {metodo === "transferencia" ? "4" : metodo ? "3" : "…"}
                </div>
                <div className="bg-white dark:bg-gray-800/60 border border-amber-100 dark:border-amber-900 rounded-2xl p-6 flex-1 hover:shadow-md transition-all duration-300">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">A aprender</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {metodo === "transferencia"
                      ? "Una vez confirmado el pago, tu clase queda reservada. Fiore te va a contactar para coordinar los detalles."
                      : metodo
                      ? "Tu clase queda reservada al instante. Fiore te va a contactar para coordinar los detalles."
                      : "Una vez confirmado el pago, tu clase queda reservada y Fiore te va a contactar."}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-10 bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Condiciones importantes</h3>
            <ul className="space-y-3">
              {[
                "El pago es por anticipado. El turno queda confirmado una vez procesado el pago.",
                "Las cancelaciones con menos de 24 horas de anticipación no tienen reembolso.",
                "Si necesitás reprogramar, avisá con al menos 24 horas de anticipación por WhatsApp.",
                "Para consultas sobre precios o paquetes de clases, escribí por WhatsApp o usá el formulario de contacto.",
              ].map((txt, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{txt}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
