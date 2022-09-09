import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
export const RequireAuth = () => {
  const location = useLocation();
      const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "You are not allowed, Please login",
  });
  localStorage.removeItem("user");
  return <Navigate to="/login" state={{ from: location }} replace />;
}
return <Outlet />;
}
