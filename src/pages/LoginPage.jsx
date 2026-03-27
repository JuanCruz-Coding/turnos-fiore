import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTurnos } from "../context/TurnosContext";
import { login } from "../services/api";

export default function LoginPage() {
  const { setToken } = useTurnos();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const data = await login(form.usuario, form.password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/admin");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }

    setCargando(false);
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mates con Fiore</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              placeholder="fiore"
              value={form.usuario}
              onChange={e => setForm({ ...form, usuario: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}