import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) {
    return null; 
  }

  if (!isAuth) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}
