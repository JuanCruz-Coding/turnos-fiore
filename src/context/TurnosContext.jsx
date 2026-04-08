import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const TurnosContext = createContext();

export function TurnosProvider({ children }) {
  const [turnos, setTurnos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    cargarHorarios();
  }, []);

  useEffect(() => {
    if (token) {
      cargarTurnos();
      cargarStats();
      cargarAlumnos();
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

  async function cargarAlumnos() {
    const data = await api.getAlumnos(token);
    setAlumnos(Array.isArray(data) ? data : []);
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
    const res = await api.solicitarTurno(turno);
    if (!res.error) await cargarHorarios();
    return res;
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

  async function confirmarPago(id) {
    const res = await api.confirmarPago(id, token);
    if (res.error) return res;
    await cargarTurnos();
    await cargarStats();
    return res;
  }

  async function eliminarTurno(id) {
    const res = await api.eliminarTurno(id, token);
    if (res.error) return res;
    await cargarTurnos();
    await cargarStats();
    return res;
  }

  async function eliminarAlumno(id) {
    const res = await api.eliminarAlumno(id, token);
    if (res.error) return res;
    await cargarAlumnos();
    await cargarTurnos();
    await cargarStats();
    return res;
  }

  async function actualizarNotas(id, notas) {
    const res = await api.actualizarNotas(id, notas, token);
    await cargarAlumnos();
    return res;
  }

  async function generarHorariosAutomaticos(datos) {
    const res = await api.generarHorarios(datos, token);
    if (res.error) return res;
    await cargarHorarios();
    return res;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setTurnos([]);
    setStats(null);
    setAlumnos([]);
  }

  return (
    <TurnosContext.Provider value={{
      turnos, horarios, stats, alumnos, token,
      setToken,
      agregarHorario, eliminarHorario,
      solicitarTurno, cancelarTurno, reprogramarTurno, eliminarTurno,
      confirmarPago, actualizarNotas, eliminarAlumno,
      generarHorariosAutomaticos,
      logout
    }}>
      {children}
    </TurnosContext.Provider>
  );
}

export function useTurnos() {
  return useContext(TurnosContext);
}