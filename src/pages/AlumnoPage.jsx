import { useState } from "react";
import { useTurnos } from "../context/TurnosContext";

export default function AlumnoPage() {
  const { horarios, solicitarTurno } = useTurnos();
  const [form, setForm] = useState({ nombre: "", email: "", nivel: "", horarioId: "" });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const horarioSeleccionado = horarios.find(h => h.id === Number(form.horarioId));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.nivel || !form.horarioId) {
      setError("Completá todos los campos.");
      return;
    }
    solicitarTurno({
      nombre: form.nombre,
      email: form.email,
      nivel: form.nivel,
      horarioId: Number(form.horarioId),
      fecha: horarioSeleccionado?.fecha,
      hora: horarioSeleccionado?.hora,
    });
    setEnviado(true);
    setError("");
    setForm({ nombre: "", email: "", nivel: "", horarioId: "" });
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mates con Fiore</h1>
          <p className="text-gray-500 mt-1">Reservá tu clase</p>
        </div>

        {enviado ? (
          <div className="bg-green-100 border border-green-300 rounded-xl p-6 text-center">
            <p className="text-green-700 font-medium text-lg">¡Turno solicitado!</p>
            <p className="text-green-600 text-sm mt-1">Fiore va a confirmar tu turno a la brevedad.</p>
            <button
              onClick={() => setEnviado(false)}
              className="mt-4 text-sm text-blue-500 underline"
            >
              Solicitar otro turno
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
              <select
                value={form.nivel}
                onChange={e => setForm({ ...form, nivel: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="">Seleccioná tu nivel</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Adultos">Adulto / otra situación</option>
                <option value="Grupo">Quiero armar un grupo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horario disponible</label>
              {horarios.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No hay horarios disponibles por el momento.</p>
              ) : (
                <select
                  value={form.horarioId}
                  onChange={e => setForm({ ...form, horarioId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="">Elegí un horario</option>
                  {horarios.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.fecha} — {h.hora}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition"
            >
              Solicitar turno
            </button>

          </form>
        )}

      </div>
    </div>
  );
}