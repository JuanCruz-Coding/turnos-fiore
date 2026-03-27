export default function Hero() {
  return (
    <section className="min-h-[88vh] flex items-center justify-center text-center px-6 py-20" style={{background: "linear-gradient(160deg, #eff6ff 0%, #ecfdf5 100%)"}}>
      <div className="max-w-2xl">
        <span className="inline-block bg-blue-50 text-blue-500 text-xs font-medium px-4 py-1.5 rounded-full border border-blue-100 mb-6 tracking-wide">
          Clases de matemáticas
        </span>
        <h1 className="font-bold text-gray-800 mb-5" style={{fontSize: "clamp(2rem, 5.5vw, 3.2rem)", lineHeight: 1.2}}>
          Las matemáticas son más fáciles de lo que creés
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
          Clases personalizadas para secundaria y adultos. Presencial en Gobernador Gálvez u online desde donde estés.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/turnos" className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition">
            Ver disponibilidad
          </a>
          <a href="#servicios" className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition">
            Ver servicios
          </a>
        </div>
      </div>
    </section>
  );
}