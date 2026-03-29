export default function SobreMi() {
  return (
    <section className="py-20 bg-white" id="sobre-mi">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="bg-blue-50 rounded-2xl overflow-hidden aspect-[4/5]">
            <img
              src="/img/foto-fiore.jpeg"
              alt="Fiore profesora de matemáticas"
              className="w-full h-full object-cover"
              onError={e => e.target.style.display = 'none'}
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hola, soy Fiore</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Soy profesora de matemáticas con experiencia. Me apasiona encontrar la forma en que cada persona aprende mejor.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              Creo que no existe el "no sirvo para las mates" — solo falta encontrar la explicación correcta. Por eso cada clase es diferente y está pensada para vos.
            </p>
            
              <a href="/turnos"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Reservar clase
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}