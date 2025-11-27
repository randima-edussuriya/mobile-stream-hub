import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

export const PrivateRoute = ({ authChecked, isLoggedIn, children }) => {
  if (!authChecked) {
    return <Loader />;
  }
  return isLoggedIn ? children : <Navigate to={"/"} replace />;
};

export const RoleRoute = ({ userData, allowedRoles, children }) => {
  return allowedRoles.includes(userData.role) ? (
    children
  ) : (
    <Navigate to={"/unauthorized"} replace />
  );
};
