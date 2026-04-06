import { Navigate } from "react-router-dom";
import { useTurnos } from "../context/TurnosContext";

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const { token, logout } = useTurnos();

  if (!token || !isTokenValid(token)) {
    if (token) logout();
    return <Navigate to="/login" replace />;
  }

  return children;
}
