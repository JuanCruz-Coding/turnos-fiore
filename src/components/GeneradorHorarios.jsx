import { useState } from "react";
import { useTurnos } from "../context/TurnosContext";

const DIAS = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 0 },
];

const NOMBRES_MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function generarMeses(cantidad = 12) {
  const meses = [];
  const hoy = new Date();
  for (let i = 0; i < cantidad; i++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const ultimoDia = new Date(year, fecha.getMonth() + 1, 0).getDate();
    meses.push({
      label: `${NOMBRES_MESES[fecha.getMonth()]} ${year}`,
      desde: `${year}-${month}-01`,
      hasta: `${year}-${month}-${String(ultimoDia).padStart(2, "0")}`,
    });
  }
  return meses;
}

const MESES = generarMeses(12);

export default function GeneradorHorarios({ onCerrar }) {
  const { generarHorariosAutomaticos } = useTurnos();
  const [modo, setModo] = useState("mes");
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [reglas, setReglas] = useState([{ dia: 1, hora: "09:00" }]);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  function agregarRegla() {
    setReglas([...reglas, { dia: 1, hora: "09:00" }]);
  }

  function eliminarRegla(i) {
    setReglas(reglas.filter((_, idx) => idx !== i));
  }

  function actualizarRegla(i, campo, valor) {
    const nuevas = [...reglas];
    nuevas[i][campo] = campo === "dia" ? parseInt(valor) : valor;
    setReglas(nuevas);
  }

  async function handleGenerar() {
    setError("");
    setResultado(null);

    let fechaDesde = desde;
    let fechaHasta = hasta;

    if (modo === "mes") {
      const mes = MESES.find(m => m.label === mesSeleccionado);
      if (!mes) { setError("Seleccioná un mes."); return; }
      fechaDesde = mes.desde;
      fechaHasta = mes.hasta;
    } else {
      if (!fechaDesde || !fechaHasta) { setError("Completá el rango de fechas."); return; }
    }

    if (!reglas.length) { setError("Agregá al menos una regla."); return; }

    setCargando(true);
    const res = await generarHorariosAutomaticos({ reglas, desde: fechaDesde, hasta: fechaHasta });
    setCargando(false);

    if (res.error) {
      setError(res.error);
    } else {
      setResultado(res.total);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">

      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Generar horarios automáticamente</h3>
        <button onClick={onCerrar} className="text-gray-300 hover:text-gray-500 text-xl transition">×</button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setModo("mes")}
          className={`px-4 py-1.5 rounded-lg text-sm transition ${modo === "mes" ? "bg-blue-500 text-white" : "border border-gray-200 text-gray-600"}`}
        >
          Por mes
        </button>
        <button
          onClick={() => setModo("rango")}
          className={`px-4 py-1.5 rounded-lg text-sm transition ${modo === "rango" ? "bg-blue-500 text-white" : "border border-gray-200 text-gray-600"}`}
        >
          Por rango de fechas
        </button>
      </div>

      {modo === "mes" ? (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mes</label>
          <select
            value={mesSeleccionado}
            onChange={e => setMesSeleccionado(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="">Seleccioná un mes</option>
            {MESES.map(m => (
              <option key={m.label} value={m.label}>{m.label}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={e => setDesde(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={e => setHasta(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Reglas de disponibilidad</label>
          <button
            onClick={agregarRegla}
            className="text-xs text-blue-500 hover:text-blue-600 border border-blue-200 px-3 py-1 rounded-lg transition"
          >
            + Agregar regla
          </button>
        </div>
        <div className="space-y-2">
          {reglas.map((regla, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select
                value={regla.dia}
                onChange={e => actualizarRegla(i, "dia", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                {DIAS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <input
                type="time"
                value={regla.hora}
                onChange={e => actualizarRegla(i, "hora", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
              {reglas.length > 1 && (
                <button
                  onClick={() => eliminarRegla(i)}
                  className="text-red-400 hover:text-red-600 text-lg transition"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {resultado !== null && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <p className="text-green-700 text-sm font-medium">
            ✓ Se generaron {resultado} horarios disponibles.
          </p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <p className="text-amber-700 text-xs">⚠ Esto va a reemplazar todos los horarios disponibles actuales. Los turnos ya reservados no se modifican.</p>
      </div>

      <button
        onClick={handleGenerar}
        disabled={cargando}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-40"
      >
        {cargando ? "Generando..." : "Generar horarios"}
      </button>

    </div>
  );
}