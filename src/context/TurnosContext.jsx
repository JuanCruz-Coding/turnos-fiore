import { createContext, useContext, useState, useEffect } from "react";

const TurnosContext = createContext();

export function TurnosProvider({ children }) {
  const [turnos, setTurnos] = useState(() => {
    const guardados = localStorage.getItem("turnos");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [horarios, setHorarios] = useState(() => {
    const guardados = localStorage.getItem("horarios");
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }, [turnos]);

  useEffect(() => {
    localStorage.setItem("horarios", JSON.stringify(horarios));
  }, [horarios]);

  function agregarHorario(horario) {
    setHorarios([...horarios, { id: Date.now(), ...horario }]);
  }

  function eliminarHorario(id) {
    setHorarios(horarios.filter(h => h.id !== id));
  }

  function solicitarTurno(turno) {
    setTurnos([...turnos, { id: Date.now(), estado: "pendiente", ...turno }]);
  }

  function confirmarTurno(id) {
    setTurnos(turnos.map(t => t.id === id ? { ...t, estado: "confirmado" } : t));
  }

  function cancelarTurno(id) {
    setTurnos(turnos.map(t => t.id === id ? { ...t, estado: "cancelado" } : t));
  }

  return (
    <TurnosContext.Provider value={{
      turnos, horarios,
      agregarHorario, eliminarHorario,
      solicitarTurno, confirmarTurno, cancelarTurno
    }}>
      {children}
    </TurnosContext.Provider>
  );
}

export function useTurnos() {
  return useContext(TurnosContext);
}