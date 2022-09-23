import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const RequireAdmin = () => {
  const user = localStorage.getItem("user");
  // @ts-ignore
  const isAdmin = JSON.parse(localStorage.getItem("user"))?.isAdmin;

  const location = useLocation();

  if (!user || !isAdmin === true) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You are not allowed, Please login as Admin",
    });
    // localStorage.removeItem("user");
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
