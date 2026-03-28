import { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", nivel: "", mensaje: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.nivel || !form.mensaje) {
      setError("Completá todos los campos.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Ingresá un email válido.");
      return;
    }
    if (form.mensaje.length < 10) {
      setError("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    const telefono = "549XXXXXXXXXX"; // ← reemplazá con el número de Fiore
    const texto = `Hola Fiore! Te escribo desde matesconfiore.com.ar 👋
*Nombre:* ${form.nombre}
*Email:* ${form.email}
*Nivel:* ${form.nivel}
*Mensaje:* ${form.mensaje}`;

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, "_blank");
    setError("");
    setForm({ nombre: "", email: "", nivel: "", mensaje: "" });
  }

  return (
    <section className="py-20 bg-blue-50" id="contacto">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¿Tenés alguna consulta?</h2>
          <p className="text-gray-400">Escribime por cualquier duda. Para reservar una clase usá el botón "Ver disponibilidad".</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <select
                value={form.nivel}
                onChange={e => setForm({ ...form, nivel: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="">Seleccioná un asunto</option>
                <option value="Consulta sobre precios">Consulta sobre precios</option>
                <option value="Consulta sobre modalidad">Consulta sobre modalidad</option>
                <option value="Consulta sobre niveles">Consulta sobre niveles</option>
                <option value="Otra consulta">Otra consulta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                rows="4"
                placeholder="¿Qué dudas tenés? ¿Querés saber más sobre las clases?"
                value={form.mensaje}
                onChange={e => setForm({ ...form, mensaje: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm transition"
            >
              Enviar por WhatsApp
            </button>
          </form>

          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">WhatsApp</p>
              <a href="https://wa.me/549XXXXXXXXXX" className="text-gray-600 hover:text-blue-500 transition">+54 9 XX XXXX-XXXX</a>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">Email</p>
              <a href="mailto:fiore@email.com" className="text-gray-600 hover:text-blue-500 transition">fiore@email.com</a>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">Modalidades</p>
              <p className="text-gray-600 text-sm">Presencial en Gobernador Gálvez</p>
              <p className="text-gray-600 text-sm">Online por videollamada</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">Horarios</p>
              <p className="text-gray-600 text-sm">Lunes a Sábado — a coordinar</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">Instagram</p>
              <a href="https://instagram.com/matesconfiore" target="_blank" className="text-gray-600 hover:text-blue-500 transition">@matesconfiore</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}