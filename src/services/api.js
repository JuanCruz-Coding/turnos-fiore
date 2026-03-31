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

export async function getResenas() {
  const res = await fetch(`${BASE_URL}/resenas`);
  return res.json();
}

export async function getTodasResenas(token) {
  const res = await fetch(`${BASE_URL}/resenas/todas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function crearResena(resena) {
  const res = await fetch(`${BASE_URL}/resenas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resena),
  });
  return res.json();
}

export async function aprobarResena(id, token) {
  const res = await fetch(`${BASE_URL}/resenas/${id}/aprobar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function eliminarResena(id, token) {
  const res = await fetch(`${BASE_URL}/resenas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function generarHorarios(datos, token) {
  const res = await fetch(`${BASE_URL}/horarios/generar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });
  return res.json();
}

export async function getAlumnos(token) {
  const res = await fetch(`${BASE_URL}/alumnos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getAlumno(id, token) {
  const res = await fetch(`${BASE_URL}/alumnos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function actualizarNotas(id, notas, token) {
  const res = await fetch(`${BASE_URL}/alumnos/${id}/notas`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notas }),
  });
  return res.json();
}

export async function confirmarPago(id, token) {
  const res = await fetch(`${BASE_URL}/turnos/${id}/pago`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pago: "recibido" }),
  });
  return res.json();
}

export async function crearPreferenciaPago(datos) {
  const res = await fetch(`${BASE_URL}/pagos/crear-preferencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}