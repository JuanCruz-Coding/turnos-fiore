const BASE_URL = import.meta.env.VITE_API_URL;

export async function login(usuario, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  return res.json();
}

export async function getHorarios() {
  const res = await fetch(`${BASE_URL}/horarios`);
  return res.json();
}

export async function agregarHorario(horario, token) {
  const res = await fetch(`${BASE_URL}/horarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(horario),
  });
  return res.json();
}

export async function eliminarHorario(id, token) {
  const res = await fetch(`${BASE_URL}/horarios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getTurnos(token) {
  const res = await fetch(`${BASE_URL}/turnos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getStats(token) {
  const res = await fetch(`${BASE_URL}/turnos/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function solicitarTurno(turno) {
  const res = await fetch(`${BASE_URL}/turnos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(turno),
  });
  return res.json();
}

export async function cancelarTurno(id, token) {
  const res = await fetch(`${BASE_URL}/turnos/${id}/cancelar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function reprogramarTurno(id, token) {
  const res = await fetch(`${BASE_URL}/turnos/${id}/reprogramar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}