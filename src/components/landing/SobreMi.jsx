import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function SobreMi() {
  const [refImg, visImg] = useScrollReveal();
  const [refText, visText] = useScrollReveal();

  return (
    <section className="py-24 bg-white dark:bg-gray-900" id="sobre-mi">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          <div
            ref={refImg}
            className={`bg-blue-50 dark:bg-blue-950/30 rounded-2xl overflow-hidden aspect-[4/5] reveal ${visImg ? "visible" : ""}`}
          >
            <img
              src="/img/foto-fiore.jpeg"
              alt="Fiore profesora de matemáticas"
              className="w-full h-full object-cover"
              onError={e => e.target.style.display = "none"}
            />
          </div>

          <div ref={refText} className={`reveal ${visText ? "visible" : ""}`}>
            <span className="inline-block text-xs font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              Sobre mí
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Hola, soy Fiore</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Soy profesora de matemáticas con experiencia. Me apasiona encontrar la forma en que cada persona aprende mejor.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Creo que no existe el "no sirvo para las mates" — solo falta encontrar la explicación correcta. Por eso cada clase es diferente y está pensada para vos.
            </p>
            <a
              href="/turnos"
              className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Reservar clase
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
