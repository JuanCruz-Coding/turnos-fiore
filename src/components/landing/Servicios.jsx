import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useState, useEffect } from "react";

const whatsapp = "5493412140785";

function IconSecundaria() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconAdultos() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  );
}

function IconGrupo() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
    </svg>
  );
}

const servicios = [
  {
    Icon: IconSecundaria,
    titulo: "Secundaria",
    desc: "Álgebra, geometría, funciones, trigonometría y más. Preparación para exámenes y recuperatorios.",
    tag: "Todos los años",
    color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    Icon: IconAdultos,
    titulo: "Adultos",
    desc: "Sin importar tu edad ni cuánto tiempo pasó. Empezamos desde donde necesitás, sin juicios.",
    tag: "A tu ritmo",
    color: "text-violet-500 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    Icon: IconGrupo,
    titulo: "Grupos reducidos",
    desc: "Clases de hasta 3 personas. Aprendés con otros y el costo es menor. Ideal para compañeros de curso.",
    tag: "Hasta 3 personas",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

export default function Servicios() {
  const [refTitle, visTitle] = useScrollReveal();
  const [refCards, visCards] = useScrollReveal();
  const [refPricing, visPricing] = useScrollReveal();
  const [esArgentina, setEsArgentina] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => setEsArgentina(d.country_code === "AR"))
      .catch(() => setEsArgentina(true));
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-gray-900" id="servicios">
      <div className="max-w-5xl mx-auto px-6">

        <div ref={refTitle} className={`text-center mb-14 reveal ${visTitle ? "visible" : ""}`}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">¿Cómo puedo ayudarte?</h2>
          <p className="text-gray-500 dark:text-gray-400">Clases adaptadas a tu nivel, ritmo y disponibilidad.</p>
        </div>

        <div ref={refCards} className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 reveal ${visCards ? "visible" : ""}`}>
          {servicios.map((s, i) => (
            <div
              key={i}
              className="group border border-gray-100 dark:border-gray-800 rounded-2xl p-7 text-center hover:border-blue-200 dark:hover:border-blue-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 dark:bg-gray-800/50"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${s.color}`}>
                <s.Icon />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{s.titulo}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{s.desc}</p>
              <span className="inline-block text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full">
                {s.tag}
              </span>
            </div>
          ))}
        </div>

        <div ref={refPricing} className={`grid grid-cols-1 md:grid-cols-2 gap-5 reveal ${visPricing ? "visible" : ""}`}>

          <div className="border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Clase individual</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                Cada clase tiene una duración de 1 hora. Reservá según la disponibilidad, sin compromisos.
              </p>
              <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 rounded-xl px-5 py-4 mb-4">
                <p className="text-xs text-blue-400 mb-1">Precio por hora</p>
                {esArgentina ? (
                  <>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$15.000</p>
                    <p className="text-xs text-gray-400 mt-1">Pesos argentinos · Transferencia o Mercado Pago</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">USD 15</p>
                    <p className="text-xs text-gray-400 mt-1">Dólares · Pago por PayPal</p>
                  </>
                )}
              </div>
            </div>
            <a
              href="/reservas"
              className="inline-block text-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Ver cómo reservar
            </a>
          </div>

          <div className="border border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Paquete mensual</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                Asegurá tus clases del mes con un paquete. Mejor precio y horarios garantizados.
              </p>
              <div className="bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-800 rounded-xl px-5 py-4 mb-4">
                <p className="text-xs text-emerald-500 mb-2">Beneficios del paquete</p>
                <ul className="space-y-1.5">
                  {["Precio preferencial por clase", "Horario fijo garantizado", "Seguimiento personalizado"].map(b => (
                    <li key={b} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2 items-center">
                      <span className="text-emerald-400 font-medium">–</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <a
              href={"https://wa.me/" + whatsapp + "?text=" + encodeURIComponent("Hola Fiore! Quiero consultar sobre el paquete mensual de clases.")}
              target="_blank"
              className="inline-block text-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Consultar por WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
