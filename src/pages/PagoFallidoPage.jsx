import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

function XIcon() {
  return (
    <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}

export default function PagoFallidoPage() {
  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-blue-50 dark:bg-gray-950 flex items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="flex justify-center mb-5">
            <XIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">El pago no se completó</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Podés intentarlo de nuevo o elegir pagar por transferencia.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/turnos"
              className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              Intentar de nuevo
            </a>
            <a
              href="/reservas"
              className="inline-block border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              Pagar por transferencia
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
