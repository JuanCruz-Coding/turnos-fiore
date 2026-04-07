export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src="/img/logo.png" alt="Mates con Fiore" className="h-30 w-auto" />
        <p className="text-sm text-gray-400 dark:text-gray-500">© 2025 Mates con Fiore — Gobernador Gálvez, Santa Fe</p>
        <div className="flex gap-5">
          <a href="#servicios" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">Servicios</a>
          <a href="#contacto" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">Contacto</a>
          <a href="/turnos" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">Turnos</a>
        </div>
      </div>
    </footer>
  );
}
