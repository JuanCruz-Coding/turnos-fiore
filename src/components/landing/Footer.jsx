export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src="/img/logo.png" alt="Mates con Fiore" className="h-30 w-auto" />
        <p className="text-sm text-gray-400">© 2025 Mates con Fiore — Gobernador Gálvez, Santa Fe</p>
        <div className="flex gap-5">
          <a href="#servicios" className="text-sm text-gray-400 hover:text-gray-600 transition">Servicios</a>
          <a href="#contacto" className="text-sm text-gray-400 hover:text-gray-600 transition">Contacto</a>
          <a href="/turnos" className="text-sm text-gray-400 hover:text-gray-600 transition">Turnos</a>
        </div>
      </div>
    </footer>
  );
}