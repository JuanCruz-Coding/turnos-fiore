import { useState } from "react";
import { useTurnos } from "../context/TurnosContext";
import { getAlumno, actualizarNotas } from "../services/api";

function Iniciales({ nombre }) {
  const partes = (nombre || "").trim().split(" ");
  const letras = partes.length >= 2
    ? partes[0][0] + partes[partes.length - 1][0]
    : (partes[0]?.[0] ?? "?");
  return letras.toUpperCase();
}

function AvatarCircle({ nombre, size = "md" }) {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-xl",
  };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      <Iniciales nombre={nombre} />
    </div>
  );
}

function StatPill({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900",
    emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900",
    amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900",
    red: "bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900",
  };
  return (
    <div className={`flex-1 min-w-0 border rounded-xl p-3 text-center ${colors[color]}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs mt-0.5 opacity-80 leading-tight">{label}</p>
    </div>
  );
}

export default function AlumnosPage() {
  const { alumnos, token, eliminarAlumno } = useTurnos();
  const [busqueda, setBusqueda] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [notas, setNotas] = useState("");
  const [guardandoNotas, setGuardandoNotas] = useState(false);
  const [notasGuardadas, setNotasGuardadas] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [cargandoAlumno, setCargandoAlumno] = useState(false);

  const alumnosFiltrados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.dni.includes(busqueda) ||
    a.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  async function handleSeleccionarAlumno(id) {
    setCargandoAlumno(true);
    setConfirmandoEliminar(false);
    const data = await getAlumno(id, token);
    setAlumnoSeleccionado(data);
    setNotas(data.notas || "");
    setNotasGuardadas(false);
    setCargandoAlumno(false);
  }

  async function handleGuardarNotas() {
    setGuardandoNotas(true);
    await actualizarNotas(alumnoSeleccionado.id, notas, token);
    setGuardandoNotas(false);
    setNotasGuardadas(true);
  }

  async function handleEliminarAlumno() {
    setEliminando(true);
    const res = await eliminarAlumno(alumnoSeleccionado.id);
    setEliminando(false);
    if (!res?.error) {
      setAlumnoSeleccionado(null);
      setConfirmandoEliminar(false);
    }
  }

  function formatFecha(fecha) {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }

  const a = alumnoSeleccionado;
  const totalClases = a?.turnos?.length ?? 0;
  const clasesConfirmadas = a?.turnos?.filter(t => t.estado === "confirmado").length ?? 0;
  const pagosRecibidos = a?.turnos?.filter(t => t.pago === "recibido").length ?? 0;
  const pagosPendientes = clasesConfirmadas - pagosRecibidos;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

      {/* Lista de alumnos */}
      <div className="md:col-span-2 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        {alumnosFiltrados.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {busqueda ? "Sin resultados." : "No hay alumnos registrados."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alumnosFiltrados.map(a => (
              <button
                key={a.id}
                onClick={() => handleSeleccionarAlumno(a.id)}
                className={`w-full text-left border rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                  alumnoSeleccionado?.id === a.id
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40 shadow-sm"
                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm"
                }`}
              >
                <AvatarCircle nombre={a.nombre} size="sm" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{a.nombre}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{a.nivel} · DNI {a.dni}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detalle del alumno */}
      <div className="md:col-span-3">
        {!alumnoSeleccionado ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-10 text-center h-full flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Seleccioná un alumno para ver su perfil.</p>
          </div>
        ) : cargandoAlumno ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando...</p>
          </div>
        ) : (
          <div className="space-y-3">

            {/* Header del alumno */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <AvatarCircle nombre={a.nombre} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{a.nombre}</h3>
                  <span className="inline-block text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 px-2.5 py-0.5 rounded-full mt-1">
                    {a.nivel}
                  </span>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <span className="truncate">{a.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5zM7.5 10.5h.008v.008H7.5v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 3h.008v.008H7.5v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 3h.008v.008H7.5v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
                      </svg>
                      <span>DNI {a.dni}</span>
                    </div>
                    {a.whatsapp && (
                      <a
                        href={`https://wa.me/54${a.whatsapp}`}
                        target="_blank"
                        className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline w-fit"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                        </svg>
                        {a.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <StatPill label="Total clases" value={totalClases} color="blue" />
                <StatPill label="Confirmadas" value={clasesConfirmadas} color="blue" />
                <StatPill label="Pagos recibidos" value={pagosRecibidos} color="emerald" />
                <StatPill label="Pagos pendientes" value={Math.max(0, pagosPendientes)} color="amber" />
              </div>
            </div>

            {/* Notas internas */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                Notas internas
              </h4>
              <textarea
                rows="3"
                placeholder="Observaciones, temas trabajados, próximos objetivos..."
                value={notas}
                onChange={e => { setNotas(e.target.value); setNotasGuardadas(false); }}
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 resize-none transition-colors duration-200"
              />
              <div className="flex items-center justify-between mt-2">
                {notasGuardadas && (
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Guardado
                  </p>
                )}
                <button
                  onClick={handleGuardarNotas}
                  disabled={guardandoNotas}
                  className="ml-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-40"
                >
                  {guardandoNotas ? "Guardando..." : "Guardar notas"}
                </button>
              </div>
            </div>

            {/* Historial de clases */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                Historial de clases
                <span className="ml-auto text-xs font-normal text-gray-400">{totalClases} {totalClases === 1 ? "clase" : "clases"}</span>
              </h4>

              {!a.turnos?.length ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-4">Sin clases registradas.</p>
              ) : (
                <div className="space-y-2">
                  {a.turnos.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{formatFecha(t.fecha)}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{t.hora?.slice(0, 5)} hs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          t.estado === "confirmado"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                        }`}>
                          {t.estado === "confirmado" ? "Confirmada" : "Cancelada"}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          t.pago === "recibido"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        }`}>
                          {t.pago === "recibido" ? "Pago OK" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Eliminar alumno */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              {!confirmandoEliminar ? (
                <button
                  onClick={() => setConfirmandoEliminar(true)}
                  className="w-full text-sm text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Eliminar alumno y su historial
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-300 font-medium">
                    Se eliminarán el alumno y todas sus clases. ¿Confirmás?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEliminarAlumno}
                      disabled={eliminando}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200 disabled:opacity-40"
                    >
                      {eliminando ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                    <button
                      onClick={() => setConfirmandoEliminar(false)}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 rounded-lg transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
