import { useScrollReveal } from "../../hooks/useScrollReveal";

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
  const [refTitle, visTitle] = useScrollReveal();
  const [refCards, visCards] = useScrollReveal();

  return (
    <section className="py-24 bg-blue-50 dark:bg-slate-900/50" id="metodologia">
      <div className="max-w-5xl mx-auto px-6">

        <div ref={refTitle} className={`text-center mb-14 reveal ${visTitle ? "visible" : ""}`}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Cómo trabajo</h2>
          <p className="text-gray-500 dark:text-gray-400">Un proceso simple pensado para que entiendas de verdad.</p>
        </div>

        <div ref={refCards} className={`grid grid-cols-1 md:grid-cols-3 gap-5 reveal ${visCards ? "visible" : ""}`}>
          {pasos.map((p, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center mb-5 text-sm">
                {p.num}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{p.titulo}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
