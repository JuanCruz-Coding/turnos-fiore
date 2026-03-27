import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TurnosProvider } from "./context/TurnosContext";
import AlumnoPage from "./pages/AlumnoPage";
import AdminPage from "./pages/AdminPage";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TurnosProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AlumnoPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </TurnosProvider>
  </StrictMode>
);