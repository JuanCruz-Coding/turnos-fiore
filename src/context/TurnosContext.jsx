import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const TurnosContext = createContext();

export function TurnosProvider({ children }) {
  const [turnos, setTurnos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    cargarHorarios();
  }, []);

  useEffect(() => {
    if (token) cargarTurnos();
  }, [token]);

  async function cargarHorarios() {
    const data = await api.getHorarios();
    setHorarios(Array.isArray(data) ? data : []);
  }

  async function cargarTurnos() {
    const data = await api.getTurnos(token);
    setTurnos(Array.isArray(data) ? data : []);
  }

  async function agregarHorario(horario) {
    await api.agregarHorario(horario, token);
    await cargarHorarios();
  }

  async function eliminarHorario(id) {
    await api.eliminarHorario(id, token);
    await cargarHorarios();
  }

  async function solicitarTurno(turno) {
    await api.solicitarTurno(turno);
    await cargarHorarios();
  }

  async function confirmarTurno(id) {
    await api.confirmarTurno(id, token);
    await cargarTurnos();
  }

  async function cancelarTurno(id) {
    await api.cancelarTurno(id, token);
    await cargarTurnos();
    await cargarHorarios();
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setTurnos([]);
  }

  return (
    <TurnosContext.Provider value={{
      turnos, horarios, token,
      setToken,
      agregarHorario, eliminarHorario,
      solicitarTurno, confirmarTurno, cancelarTurno,
      logout
    }}>
      {children}
    </TurnosContext.Provider>
  );
}

export function useTurnos() {
  return useContext(TurnosContext);
}