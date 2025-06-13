import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const [auth, setAuth] = useState({ isAuthenticated: null, role: null });
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/check", {
        withCredentials: true,
      })
      .then((res) => {
        setAuth({ isAuthenticated: true, role: res.data.role });
      })
      .catch(() => {
        setAuth({ isAuthenticated: false, role: null });
      });
  }, []);

  const getRedirectPath = () => {
    if (allowedRoles.includes("patient")) return "/patients/login";
    return "/secure-login";
  };

  if (auth.isAuthenticated === null) {
    return <p className="text-center text-gray-600 mt-20">Checking authentication...</p>;
  }

  if (!auth.isAuthenticated || !allowedRoles.includes(auth.role)) {
    return <Navigate to={getRedirectPath()} state={{ from: location }} replace/>;
  }

  return children;
}
