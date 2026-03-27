import { Navigate } from "react-router-dom";
import { useTurnos } from "../context/TurnosContext";

export default function ProtectedRoute({ children }) {
  const { token } = useTurnos();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}