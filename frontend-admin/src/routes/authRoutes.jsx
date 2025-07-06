import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? children : <Navigate to={'/'} replace />;
}

export const RoleRoute = ({ children, allowedRoles }) => {
    const { currentUser } = useContext(AuthContext);
    return allowedRoles.includes(currentUser.role) ? children : <Navigate to={'/unathorized'} replace />
}