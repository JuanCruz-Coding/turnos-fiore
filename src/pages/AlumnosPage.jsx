import { useState } from "react";
import { useTurnos } from "../context/TurnosContext";
import { getAlumno, actualizarNotas } from "../services/api";

export default function AlumnosPage() {
  const { alumnos, token } = useTurnos();
  const [busqueda, setBusqueda] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [notas, setNotas] = useState("");
  const [guardandoNotas, setGuardandoNotas] = useState(false);
  const [notasGuardadas, setNotasGuardadas] = useState(false);

  const alumnosFiltrados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.dni.includes(busqueda) ||
    a.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  async function handleSeleccionarAlumno(id) {
    const data = await getAlumno(id, token);
    setAlumnoSeleccionado(data);
    setNotas(data.notas || "");
    setNotasGuardadas(false);
  }

  async function handleGuardarNotas() {
    setGuardandoNotas(true);
    await actualizarNotas(alumnoSeleccionado.id, notas, token);
    setGuardandoNotas(false);
    setNotasGuardadas(true);
  }

  function formatFecha(fecha) {
    if (!fecha) return "";
    const [year, month, day] = fecha.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  const pagoColor = {
    pendiente: "bg-yellow-100 text-yellow-700",
    recibido: "bg-green-100 text-green-700",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <input
          type="text"
          placeholder="Buscar por nombre, DNI o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 mb-4"
        />

        {alumnosFiltrados.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">No hay alumnos registrados todavía.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alumnosFiltrados.map(a => (
              <button
                key={a.id}
                onClick={() => handleSeleccionarAlumno(a.id)}
                className={`w-full text-left border rounded-xl px-4 py-3 transition ${alumnoSeleccionado?.id === a.id ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-white hover:border-blue-200"}`}
              >
                <p className="font-medium text-gray-800 text-sm">{a.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">DNI: {a.dni} · {a.nivel}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {!alumnoSeleccionado ? (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">Seleccioná un alumno para ver su historial.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">{alumnoSeleccionado.nombre}</h3>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500">DNI: <span className="text-gray-700">{alumnoSeleccionado.dni}</span></p>
                <p className="text-xs text-gray-500">Email: <span className="text-gray-700">{alumnoSeleccionado.email}</span></p>
                <p className="text-xs text-gray-500">WhatsApp: 
                  <a href={"https://wa.me/54" + alumnoSeleccionado.whatsapp} target="_blank" className="text-emerald-600 ml-1">
                    {alumnoSeleccionado.whatsapp}
                  </a>
                </p>
                <p className="text-xs text-gray-500">Nivel: <span className="text-gray-700">{alumnoSeleccionado.nivel}</span></p>
                <p className="text-xs text-gray-500">Clases totales: <span className="font-medium text-blue-600">{alumnoSeleccionado.turnos?.length ?? 0}</span></p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Notas internas</h4>
              <textarea
                rows="3"
                placeholder="Observaciones sobre el alumno, temas trabajados, etc..."
                value={notas}
                onChange={e => { setNotas(e.target.value); setNotasGuardadas(false); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
              <button
                onClick={handleGuardarNotas}
                disabled={guardandoNotas}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition disabled:opacity-40"
              >
                {guardandoNotas ? "Guardando..." : notasGuardadas ? "✓ Guardado" : "Guardar notas"}
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">Historial de clases</h4>
              {!alumnoSeleccionado.turnos?.length ? (
                <p className="text-xs text-gray-400 italic">Sin clases registradas.</p>
              ) : (
                <div className="space-y-2">
                  {alumnoSeleccionado.turnos.map(t => (
                    <div key={t.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-none">
                      <div>
                        <p className="text-sm text-gray-700">{formatFecha(t.fecha)} — {t.hora?.slice(0, 5)} hs</p>
                        <p className="text-xs text-gray-400">{t.nivel}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${pagoColor[t.pago] || "bg-gray-100 text-gray-500"}`}>
                        {t.pago === "recibido" ? "Pago recibido" : "Pago pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}