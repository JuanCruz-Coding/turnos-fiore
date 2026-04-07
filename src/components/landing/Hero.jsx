import { useEffect, useState } from "react";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="min-h-[88vh] flex items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900"
    >
      <div className={`max-w-2xl transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <span className="inline-block bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800 mb-6 tracking-wide uppercase">
          Clases de matemáticas
        </span>
        <h1
          className="font-bold text-gray-900 dark:text-white mb-5 leading-tight"
          style={{ fontSize: "clamp(2rem, 5.5vw, 3.2rem)" }}
        >
          Las matemáticas son más fáciles de lo que creés
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Clases personalizadas y online desde donde estés.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="/turnos"
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-7 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Ver disponibilidad
          </a>
          <a
            href="#servicios"
            className="border-2 border-blue-200 dark:border-blue-700 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium px-7 py-3 rounded-lg transition-colors duration-200"
          >
            Ver servicios
          </a>
        </div>
      </div>
    </section>
  );
}
