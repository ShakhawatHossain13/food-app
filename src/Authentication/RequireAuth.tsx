import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const RequireAuth = () => {
  const user = localStorage.getItem("user");
  // @ts-ignore
  const isAdmin = JSON.parse(localStorage.getItem("user"))?.isAdmin;

  const location = useLocation();

  if (!user || isAdmin === true) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You are not allowed, Please login as User ...",
    });
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
