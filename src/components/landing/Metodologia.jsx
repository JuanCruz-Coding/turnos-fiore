const pasos = [
  {
    num: "1",
    titulo: "Diagnóstico inicial",
    desc: "En la primera clase evaluamos tu nivel y definimos qué necesitás trabajar para llegar a tu objetivo."
  },
  {
    num: "2",
    titulo: "Clases personalizadas",
    desc: "Cada clase está pensada para vos. Explicaciones claras, ejemplos reales y ejercicios graduales."
  },
  {
    num: "3",
    titulo: "Seguimiento continuo",
    desc: "Revisamos tu progreso clase a clase y ajustamos el ritmo según cómo vayas avanzando."
  }
];

export default function Metodologia() {
  return (
    <section className="py-20 bg-blue-50" id="metodologia">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Cómo trabajo</h2>
          <p className="text-gray-400">Un proceso simple pensado para que entiendas de verdad.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pasos.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-7">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center mb-4">
                {p.num}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{p.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}