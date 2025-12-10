import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ onToggle }) {
  const { backendUrl, setIsLoggedIn, setUserData, userData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handelLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/admin/auth/logout`);
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, Please try again later"
      );
      console.error(error);
    }
  };
  return (
    <nav className="navbar navbar-expand navbar-dark px-3 bg-dark sticky-top">
      <i
        className="navbar-brand bi bi-justify-left fs-5"
        onClick={onToggle}
      ></i>
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle fs-5"></i>
          </a>
          <ul role="button" className="dropdown-menu dropdown-menu-end">
            <li onClick={() => navigate("/profile")}>
              <a className="dropdown-item">Profile</a>
            </li>
            <li role="button" onClick={handelLogout}>
              <a className="dropdown-item">Logout</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
