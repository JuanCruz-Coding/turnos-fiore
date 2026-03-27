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

export default function Servicios() {
  return (
    <section className="py-20 bg-white" id="servicios">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¿Cómo puedo ayudarte?</h2>
          <p className="text-gray-400">Clases adaptadas a tu nivel, ritmo y disponibilidad.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
      </div>
    </section>
  );
}