const servicios = [
  {
    icon: "📐",
    titulo: "Secundaria",
    desc: "Álgebra, geometría, funciones, trigonometría y más. Preparación para exámenes y recuperatorios.",
    tag: "Todos los años"
  },
  {
    icon: "🎓",
    titulo: "Adultos",
    desc: "Sin importar tu edad ni cuánto tiempo pasó. Empezamos desde donde necesitás, sin juicios.",
    tag: "A tu ritmo"
  },
  {
    icon: "👥",
    titulo: "Grupos reducidos",
    desc: "Clases de hasta 3 personas. Aprendés con otros y el costo es menor. Ideal para compañeros de curso.",
    tag: "Hasta 3 personas"
  }
];

const whatsapp = "5493412140785"; 

export default function Servicios() {
  return (
    <section className="py-20 bg-white" id="servicios">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¿Cómo puedo ayudarte?</h2>
          <p className="text-gray-400">Clases adaptadas a tu nivel, ritmo y disponibilidad.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {servicios.map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-7 text-center hover:border-blue-300 hover:-translate-y-1 transition-all duration-200">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{s.titulo}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{s.desc}</p>
              <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                {s.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="border border-blue-100 bg-blue-50 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Valor por clase</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">Cada clase individual tiene una duración de 1 hora. Podés reservar cuando quieras según la disponibilidad.</p>
              <div className="bg-white border border-blue-100 rounded-xl px-5 py-4 mb-4">
                <p className="text-xs text-blue-400 mb-1">Precio por hora</p>
                <p className="text-3xl font-bold text-blue-600">$15.000</p>
                <p className="text-xs text-gray-400 mt-1">Pesos argentinos · Pago por transferencia</p>
              </div>
            </div>
            <a
              href={"/reservas"}
              className="inline-block text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Ver cómo reservar
            </a>
          </div>

          <div className="border border-emerald-100 bg-emerald-50 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Paquete mensual</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">Asegurá tus clases del mes con un paquete. Mejor precio por clase y horarios garantizados sin preocuparte por la disponibilidad.</p>
              <div className="bg-white border border-emerald-100 rounded-xl px-5 py-4 mb-4">
                <p className="text-xs text-emerald-500 mb-1">Beneficios del paquete</p>
                <ul className="space-y-1 mt-1">
                  <li className="text-sm text-gray-600 flex gap-2"><span className="text-emerald-400">✓</span>Precio preferencial por clase</li>
                  <li className="text-sm text-gray-600 flex gap-2"><span className="text-emerald-400">✓</span>Horario fijo garantizado</li>
                  <li className="text-sm text-gray-600 flex gap-2"><span className="text-emerald-400">✓</span>Seguimiento personalizado</li>
                </ul>
              </div>
            </div>
            <a
              href={"https://wa.me/" + whatsapp + "?text=" + encodeURIComponent("Hola Fiore! Quiero consultar sobre el paquete mensual de clases 📦")}
              target="_blank"
              className="inline-block text-center bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Consultar por WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}