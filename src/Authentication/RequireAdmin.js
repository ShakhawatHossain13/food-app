import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const RequireAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // const cart = JSON.parse(localStorage.getItem("cart"));
  console.log(user);
  // console.log(cart);
  const location = useLocation();

  if (!user || !user.isAdmin !== true) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You are not allowed, Please login as Admin",
    });
    localStorage.removeItem("user");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
