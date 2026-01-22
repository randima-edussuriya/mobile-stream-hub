import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

export const PrivateRoute = ({ authChecked, isLoggedIn, children }) => {
  if (!authChecked) {
    return <Loader type="fullpage" />;
  }
  return isLoggedIn ? children : <Navigate to={"/"} replace />;
};

export const RoleRoute = ({ userData, allowedRoles, children }) => {
  return allowedRoles.includes(userData.userRole) ? (
    children
  ) : (
    <Navigate to={"/unauthorized"} replace />
  );
};
