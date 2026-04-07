import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TurnosProvider } from "./context/TurnosContext";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import TurnosPage from "./pages/TurnosPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ReservasPage from "./pages/ReservasPage";
import PagoExitosoPage from "./pages/PagoExitosoPage";
import PagoFallidoPage from "./pages/PagoFallidoPage";
import PagoPendientePage from "./pages/PagoPendientePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <TurnosProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/turnos" element={<TurnosPage />} />
              <Route path="/reservas" element={<ReservasPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/turnos/pago-exitoso" element={<PagoExitosoPage />} />
              <Route path="/turnos/pago-fallido" element={<PagoFallidoPage />} />
              <Route path="/turnos/pago-pendiente" element={<PagoPendientePage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TurnosProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
