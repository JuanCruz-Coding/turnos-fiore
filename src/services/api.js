const BASE_URL = import.meta.env.VITE_API_URL;

async function handleResponse(res) {
  if (!res.ok) {
    try {
      const body = await res.json();
      return { error: body.error || body.message || `Error ${res.status}` };
    } catch {
      return { error: `Error ${res.status}` };
    }
  }
  return res.json();
}

export async function login(usuario, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getHorarios() {
  try {
    const res = await fetch(`${BASE_URL}/horarios`);
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function agregarHorario(horario, token) {
  try {
    const res = await fetch(`${BASE_URL}/horarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(horario),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function eliminarHorario(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/horarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getTurnos(token) {
  try {
    const res = await fetch(`${BASE_URL}/turnos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getStats(token) {
  try {
    const res = await fetch(`${BASE_URL}/turnos/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function solicitarTurno(turno) {
  try {
    const res = await fetch(`${BASE_URL}/turnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turno),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function cancelarTurno(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/turnos/${id}/cancelar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function reprogramarTurno(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/turnos/${id}/reprogramar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getResenas() {
  try {
    const res = await fetch(`${BASE_URL}/resenas`);
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getTodasResenas(token) {
  try {
    const res = await fetch(`${BASE_URL}/resenas/todas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function crearResena(resena) {
  try {
    const res = await fetch(`${BASE_URL}/resenas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resena),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function aprobarResena(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/resenas/${id}/aprobar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function eliminarResena(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/resenas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function generarHorarios(datos, token) {
  try {
    const res = await fetch(`${BASE_URL}/horarios/generar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getAlumnos(token) {
  try {
    const res = await fetch(`${BASE_URL}/alumnos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getAlumno(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/alumnos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function actualizarNotas(id, notas, token) {
  try {
    const res = await fetch(`${BASE_URL}/alumnos/${id}/notas`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notas }),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function confirmarPago(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/turnos/${id}/pago`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pago: "recibido" }),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function crearPreferenciaPago(datos) {
  try {
    const res = await fetch(`${BASE_URL}/pagos/crear-preferencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

// ─── Disponibilidad recurrente ────────────────────────────────────────────────

export async function getSlots() {
  try {
    const res = await fetch(`${BASE_URL}/horarios/slots`);
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getDisponibilidad(token) {
  try {
    const res = await fetch(`${BASE_URL}/disponibilidad`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function crearDisponibilidad(regla, token) {
  try {
    const res = await fetch(`${BASE_URL}/disponibilidad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(regla),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function eliminarDisponibilidad(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/disponibilidad/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function actualizarDisponibilidad(id, datos, token) {
  try {
    const res = await fetch(`${BASE_URL}/disponibilidad/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return handleResponse(res);
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}
