import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const RequireAuth = () => {
  const user = localStorage.getItem("user");

  const location = useLocation();

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You are not allowed, Please login ...",
    });
    localStorage.removeItem("user");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
