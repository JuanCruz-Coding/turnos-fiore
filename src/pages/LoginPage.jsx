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
    <div className="min-h-screen bg-blue-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          <img src="/img/logo.png" alt="Mates con Fiore" className="h-16 w-auto mx-auto mb-4" onError={e => e.target.style.display = "none"} />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Panel de administración</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Mates con Fiore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
            <input
              type="text"
              placeholder="fiore"
              value={form.usuario}
              onChange={e => setForm({ ...form, usuario: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 mt-2"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}
