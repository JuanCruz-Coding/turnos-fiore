import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

export default function PagoExitosoPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago exitoso!</h1>
          <p className="text-gray-500 mb-2">Tu clase quedó reservada y confirmada.</p>
          <p className="text-gray-400 text-sm mb-6">Fiore te va a contactar para coordinar los detalles.</p>
          {paymentId && (
            <p className="text-xs text-gray-300 mb-6">ID de pago: {paymentId}</p>
          )}
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            Volver al inicio
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}