import { useState, useEffect } from "react";
import { getResenas, crearResena } from "../../services/api";

export default function Resenas() {
  const [resenas, setResenas] = useState([]);
  const [form, setForm] = useState({ nombre: "", texto: "", estrellas: 5 });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    getResenas().then(data => setResenas(Array.isArray(data) ? data : []));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.texto) {
      setError("Completá todos los campos.");
      return;
    }
    const res = await crearResena(form);
    if (res.error) {
      setError(res.error);
      return;
    }
    setEnviado(true);
    setError("");
    setForm({ nombre: "", texto: "", estrellas: 5 });
  }

  function Estrellas({ cantidad }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={i <= cantidad ? "text-amber-400" : "text-gray-200"}>
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <section className="py-20 bg-white" id="resenas">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Lo que dicen mis alumnos</h2>
          <p className="text-gray-400">Opiniones reales de quienes ya tomaron clases.</p>
        </div>

        {resenas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Todavía no hay reseñas. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {resenas.map(r => (
              <div key={r.id} className="border border-gray-100 rounded-2xl p-6">
                <Estrellas cantidad={r.estrellas} />
                <p className="text-gray-600 text-sm mt-3 mb-4 leading-relaxed">"{r.texto}"</p>
                <p className="font-medium text-gray-800 text-sm">{r.nombre}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          {!mostrarForm ? (
            <button
              onClick={() => setMostrarForm(true)}
              className="border border-blue-200 text-blue-500 hover:bg-blue-50 px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Dejar una reseña
            </button>
          ) : enviado ? (
            <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-2xl p-6">
              <p className="text-green-700 font-medium">¡Gracias por tu reseña!</p>
              <p className="text-green-600 text-sm mt-1">Va a aparecer una vez que Fiore la apruebe.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl p-6 text-left space-y-4"
            >
              <h3 className="font-bold text-gray-800">Dejá tu reseña</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu experiencia</label>
                <textarea
                  rows="3"
                  placeholder="Contá cómo fue tu experiencia con las clases..."
                  value={form.texto}
                  onChange={e => setForm({ ...form, texto: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, estrellas: i })}
                      className={`text-2xl transition ${i <= form.estrellas ? "text-amber-400" : "text-gray-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition"
                >
                  Enviar reseña
                </button>
                <button
                  type="button"
                  onClick={() => { setMostrarForm(false); setError(""); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}