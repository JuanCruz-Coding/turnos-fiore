import { useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", nivel: "", mensaje: "" });
  const [error, setError] = useState("");
  const [refTitle, visTitle] = useScrollReveal();
  const [refContent, visContent] = useScrollReveal();

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

    const telefono = "5493412140785";
    const texto = `Hola Fiore! Te escribo desde matesconfiore.com.ar
*Nombre:* ${form.nombre}
*Email:* ${form.email}
*Nivel:* ${form.nivel}
*Mensaje:* ${form.mensaje}`;

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, "_blank");
    setError("");
    setForm({ nombre: "", email: "", nivel: "", mensaje: "" });
  }

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <section className="py-24 bg-blue-50 dark:bg-slate-900/50" id="contacto">
      <div className="max-w-5xl mx-auto px-6">

        <div ref={refTitle} className={`text-center mb-14 reveal ${visTitle ? "visible" : ""}`}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">¿Tenés alguna consulta?</h2>
          <p className="text-gray-500 dark:text-gray-400">Escribime por cualquier duda. Para reservar usá "Ver disponibilidad".</p>
        </div>

        <div ref={refContent} className={`grid grid-cols-1 md:grid-cols-2 gap-10 reveal ${visContent ? "visible" : ""}`}>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 space-y-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Asunto</label>
              <select
                value={form.nivel}
                onChange={e => setForm({ ...form, nivel: e.target.value })}
                className={inputClass}
              >
                <option value="">Seleccioná un asunto</option>
                <option value="Consulta sobre precios">Consulta sobre precios</option>
                <option value="Consulta sobre modalidad">Consulta sobre modalidad</option>
                <option value="Consulta sobre niveles">Consulta sobre niveles</option>
                <option value="Otra consulta">Otra consulta</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Mensaje</label>
              <textarea
                rows="4"
                placeholder="¿Qué dudas tenés? ¿Querés saber más sobre las clases?"
                value={form.mensaje}
                onChange={e => setForm({ ...form, mensaje: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors duration-200"
            >
              Enviar por WhatsApp
            </button>
          </form>

          <div className="space-y-6 pt-2">
            {[
              { label: "WhatsApp", content: <a href="https://wa.me/5493412140785" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">+54 9 341 214-0785</a> },
              { label: "Email", content: <a href="mailto:fiore@email.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">fiore@email.com</a> },
              { label: "Modalidades", content: <p className="text-gray-600 dark:text-gray-300 text-sm">Online por videollamada</p> },
              { label: "Horarios", content: <p className="text-gray-600 dark:text-gray-300 text-sm">Lunes a Sábado — a coordinar</p> },
              { label: "Instagram", content: <a href="https://instagram.com/matesconfiore" target="_blank" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">@matesconfiore</a> },
            ].map(({ label, content }) => (
              <div key={label}>
                <p className="text-xs font-medium text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">{label}</p>
                {content}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
