import { useState } from "react";

export default function Nav() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">

                <a href="/" className="flex items-center">
                    <img src="./src/img/logo.png" alt="Mates con Fiore" className="h-30 w-auto" />
                </a>

                <button
                    className="md:hidden flex flex-col gap-1.5 p-1"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <span className="block w-6 h-0.5 bg-gray-700"></span>
                    <span className="block w-6 h-0.5 bg-gray-700"></span>
                    <span className="block w-6 h-0.5 bg-gray-700"></span>
                </button>

                <nav className={`${menuAbierto ? "flex" : "hidden"} md:flex absolute md:static top-full left-0 right-0 bg-white md:bg-transparent flex-col md:flex-row items-start md:items-center gap-6 px-6 md:px-0 py-4 md:py-0 border-b md:border-none border-gray-100`}>
                    <a href="/#servicios" className="text-sm text-gray-500 hover:text-gray-800 transition" onClick={() => setMenuAbierto(false)}>Servicios</a>
                    <a href="/#metodologia" className="text-sm text-gray-500 hover:text-gray-800 transition" onClick={() => setMenuAbierto(false)}>Metodología</a>
                    <a href="/#sobre-mi" className="text-sm text-gray-500 hover:text-gray-800 transition" onClick={() => setMenuAbierto(false)}>Sobre mí</a>
                    <a href="/#contacto" className="text-sm text-gray-500 hover:text-gray-800 transition" onClick={() => setMenuAbierto(false)}>Contacto</a>
                    <a href="/#resenas" className="text-sm text-gray-500 hover:text-gray-800 transition" onClick={() => setMenuAbierto(false)}>Reseñas</a>
                    <a href="/turnos" className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition" onClick={() => setMenuAbierto(false)}>Ver disponibilidad</a>
                    <a href="/login" className="text-sm border border-gray-200 hover:border-gray-400 text-gray-600 px-4 py-2 rounded-lg transition" onClick={() => setMenuAbierto(false)}>Iniciar sesión</a>
                </nav>

            </div>
        </header>
    );
}