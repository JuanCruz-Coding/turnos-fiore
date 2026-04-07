import { useState } from "react";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

export default function ReservasPage() {
  const alias = "fiorellacozza.mp";
  const whatsapp = "549XXXXXXXXXX";
  const [copiado, setCopiado] = useState(false);

  function copiarAlias() {
    navigator.clipboard.writeText(alias);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const pasos = [
    {
      num: "1",
      titulo: "Elegí tu horario",
      desc: "Entrá al calendario de disponibilidad y elegí el día y hora que mejor te quede.",
      accion: { texto: "Ver disponibilidad", link: "/turnos" },
      color: "bg-blue-500",
      border: "border-blue-100 dark:border-blue-900",
    },
    {
      num: "2",
      titulo: "Pagá por transferencia",
      desc: "Realizá la transferencia por el valor de la clase al siguiente alias de Mercado Pago.",
      extra: alias,
      color: "bg-emerald-500",
      border: "border-emerald-100 dark:border-emerald-900",
    },
    {
      num: "3",
      titulo: "Enviá el comprobante",
      desc: "Mandá el comprobante de pago por WhatsApp junto con tu nombre y el horario reservado.",
      accion: { texto: "Abrir WhatsApp", link: "https://wa.me/" + whatsapp },
      color: "bg-violet-500",
      border: "border-violet-100 dark:border-violet-900",
    },
    {
      num: "4",
      titulo: "A aprender",
      desc: "Una vez confirmado el pago, tu clase queda reservada. Fiore te va a contactar para coordinar los detalles.",
      color: "bg-amber-500",
      border: "border-amber-100 dark:border-amber-900",
    }
  ];

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
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

            <div className="space-y-6">
              {pasos.map((paso, i) => (
                <div key={i} className="relative flex gap-6 items-start">
                  <div className={`w-12 h-12 rounded-full ${paso.color} text-white font-bold text-lg flex items-center justify-center flex-shrink-0 z-10 shadow-sm`}>
                    {paso.num}
                  </div>
                  <div className={`bg-white dark:bg-gray-800/60 border ${paso.border} rounded-2xl p-6 flex-1 hover:shadow-md transition-all duration-300`}>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{paso.titulo}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">{paso.desc}</p>

                    {paso.extra && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-xl px-5 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-emerald-500 dark:text-emerald-400 mb-0.5">Alias Mercado Pago</p>
                          <p className="font-bold text-emerald-700 dark:text-emerald-300 text-lg tracking-wide">{paso.extra}</p>
                        </div>
                        <button
                          onClick={copiarAlias}
                          className="text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors duration-200"
                        >
                          {copiado ? "Copiado" : "Copiar"}
                        </button>
                      </div>
                    )}

                    {paso.accion && (
                      <a
                        href={paso.accion.link}
                        target={paso.accion.link.startsWith("http") ? "_blank" : "_self"}
                        className="inline-block mt-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-200"
                      >
                        {paso.accion.texto}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Condiciones importantes</h3>
            <ul className="space-y-3">
              {[
                "El pago es por anticipado. El turno queda confirmado una vez recibido el comprobante.",
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
