import { useState } from "react";
import { useTurnos } from "../context/TurnosContext";

export default function AdminPage() {
  const { turnos, horarios, agregarHorario, eliminarHorario, confirmarTurno, cancelarTurno, logout } = useTurnos();
  const [form, setForm] = useState({ fecha: "", hora: "" });
  const [vista, setVista] = useState("turnos");

  async function handleAgregarHorario(e) {
    e.preventDefault();
    if (!form.fecha || !form.hora) return;
    await agregarHorario(form);
    setForm({ fecha: "", hora: "" });
  }

  const pendientes = turnos.filter(t => t.estado === "pendiente");
  const confirmados = turnos.filter(t => t.estado === "confirmado");
  const cancelados = turnos.filter(t => t.estado === "cancelado");

  const estadoColor = {
    pendiente: "bg-yellow-100 text-yellow-700",
    confirmado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Fiore</h1>
            <p className="text-gray-400 text-sm">Mates con Fiore — administración</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-blue-500 underline">Ver vista alumno</a>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-600 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendientes.length}</p>
            <p className="text-xs text-yellow-500 mt-1">Pendientes</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{confirmados.length}</p>
            <p className="text-xs text-green-500 mt-1">Confirmados</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{cancelados.length}</p>
            <p className="text-xs text-red-400 mt-1">Cancelados</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setVista("turnos")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${vista === "turnos" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            Turnos solicitados
          </button>
          <button
            onClick={() => setVista("horarios")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${vista === "horarios" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            Mis horarios
          </button>
        </div>

        {vista === "turnos" && (
          <div className="space-y-3">
            {turnos.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm">No hay turnos solicitados todavía.</p>
              </div>
            ) : (
              turnos.map(t => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-800">{t.nombre}</p>
                      <p className="text-sm text-gray-400">{t.email} · {t.nivel}</p>
                      <p className="text-sm text-gray-500 mt-1">
  {new Date(t.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })} — {t.hora?.slice(0, 5)}
</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColor[t.estado]}`}>
                      {t.estado}
                    </span>
                  </div>
                  {t.estado === "pendiente" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => confirmarTurno(t.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded-lg transition"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => cancelarTurno(t.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm py-1.5 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {vista === "horarios" && (
          <div className="space-y-4">
            <form onSubmit={handleAgregarHorario} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
                <input
                  type="time"
                  value={form.hora}
                  onChange={e => setForm({ ...form, hora: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Agregar
              </button>
            </form>

            <div className="space-y-2">
              {horarios.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                  <p className="text-gray-400 text-sm">No hay horarios cargados todavía.</p>
                </div>
              ) : (
                horarios.map(h => (
                  <div key={h.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
  {new Date(h.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })} — {h.hora.slice(0, 5)}
</p>
                    <button
                      onClick={() => eliminarHorario(h.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}