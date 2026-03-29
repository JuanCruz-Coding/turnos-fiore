import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TurnosProvider } from "./context/TurnosContext";
import LandingPage from "./pages/LandingPage";
import TurnosPage from "./pages/TurnosPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ReservasPage from "./pages/ReservasPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TurnosProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/turnos" element={<TurnosPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TurnosProvider>
  </StrictMode>
);