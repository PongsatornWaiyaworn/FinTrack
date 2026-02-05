import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const { token } = useAuth();

  if (token === undefined) {
    return null;
  }

  if (!token) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}
