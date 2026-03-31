import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

export default function PagoFallidoPage() {
  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">El pago no se completó</h1>
          <p className="text-gray-500 mb-6">Podés intentarlo de nuevo o elegir pagar por transferencia.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/turnos"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              Intentar de nuevo
            </a>
            <a
              href="/reservas"
              className="inline-block border border-gray-200 hover:border-gray-400 text-gray-600 font-medium px-6 py-2.5 rounded-lg transition"
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