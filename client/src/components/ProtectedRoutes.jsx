/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/check", {
      withCredentials: true,
    })
      .then((res) => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <p>Checking authentication...</p>; // show loading while checking
  }

  if (!isAuthenticated) {
    return <Navigate to="/patients/login" state={{ from: location }} replace />;
  }

  return children;
}
