import { useSearchParams } from "react-router-dom";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

function CheckIcon() {
  return (
    <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}

export default function PagoExitosoPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="dark:bg-gray-950">
      <Nav />
      <main className="min-h-screen bg-blue-50 dark:bg-gray-950 flex items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="flex justify-center mb-5">
            <CheckIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Pago exitoso!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Tu clase quedó reservada y confirmada.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Fiore te va a contactar para coordinar los detalles.</p>
          {paymentId && (
            <p className="text-xs text-gray-300 dark:text-gray-600 mb-6">ID de pago: {paymentId}</p>
          )}
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
          >
            Volver al inicio
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
