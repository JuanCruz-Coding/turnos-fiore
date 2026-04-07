import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
    </svg>
  );
}

export default function Nav() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = "text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200";

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        <a href="/" className="flex items-center">
          <img src="/img/logo.png" alt="Mates con Fiore" className="h-30 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#servicios"   className={linkClass}>Servicios</a>
          <a href="/#metodologia" className={linkClass}>Metodología</a>
          <a href="/reservas"     className={linkClass}>Cómo reservar</a>
          <a href="/#sobre-mi"    className={linkClass}>Sobre mí</a>
          <a href="/#resenas"     className={linkClass}>Reseñas</a>
          <a href="/#contacto"    className={linkClass}>Contacto</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Cambiar modo"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/turnos" className="text-sm bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
            Ver disponibilidad
          </a>
          <a href="/login" className="text-sm border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg transition-colors duration-200">
            Iniciar sesión
          </a>
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Cambiar modo"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="p-2 flex flex-col gap-1.5"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuAbierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="px-6 pb-5 pt-2 flex flex-col gap-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          {[
            { href: "/#servicios",   label: "Servicios" },
            { href: "/#metodologia", label: "Metodología" },
            { href: "/reservas",     label: "Cómo reservar" },
            { href: "/#sobre-mi",    label: "Sobre mí" },
            { href: "/#resenas",     label: "Reseñas" },
            { href: "/#contacto",    label: "Contacto" },
          ].map(({ href, label }) => (
            <a key={href} href={href} className={linkClass} onClick={() => setMenuAbierto(false)}>{label}</a>
          ))}
          <div className="flex gap-3 pt-2">
            <a href="/turnos" onClick={() => setMenuAbierto(false)} className="flex-1 text-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
              Ver disponibilidad
            </a>
            <a href="/login" onClick={() => setMenuAbierto(false)} className="flex-1 text-center text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg transition-colors duration-200">
              Iniciar sesión
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
