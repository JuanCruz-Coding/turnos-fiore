import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const TurnosContext = createContext();

export function TurnosProvider({ children }) {
  const [turnos, setTurnos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    cargarHorarios();
  }, []);

  useEffect(() => {
    if (token) {
      cargarTurnos();
      cargarStats();
    }
  }, [token]);

  async function cargarHorarios() {
    const data = await api.getHorarios();
    setHorarios(Array.isArray(data) ? data : []);
  }

  async function cargarTurnos() {
    const data = await api.getTurnos(token);
    setTurnos(Array.isArray(data) ? data : []);
  }

  async function cargarStats() {
    const data = await api.getStats(token);
    setStats(data);
  }

async function agregarHorario(horario) {
  const [year, month, day] = horario.fecha.split('-');
  const fechaCorregida = `${year}-${month}-${day}`;
  await api.agregarHorario({ ...horario, fecha: fechaCorregida }, token);
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

  async function cancelarTurno(id) {
    const res = await api.cancelarTurno(id, token);
    if (res.error) return res;
    await cargarTurnos();
    await cargarHorarios();
    await cargarStats();
    return res;
  }

  async function reprogramarTurno(id) {
    const res = await api.reprogramarTurno(id, token);
    if (res.error) return res;
    await cargarTurnos();
    await cargarHorarios();
    await cargarStats();
    return res;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setTurnos([]);
    setStats(null);
  }

  return (
    <TurnosContext.Provider value={{
      turnos, horarios, stats, token,
      setToken,
      agregarHorario, eliminarHorario,
      solicitarTurno, cancelarTurno, reprogramarTurno,
      logout
    }}>
      {children}
    </TurnosContext.Provider>
  );
}

export function useTurnos() {
  return useContext(TurnosContext);
}