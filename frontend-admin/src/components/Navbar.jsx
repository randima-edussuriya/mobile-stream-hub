import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ onToggle }) {
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
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
    <>
      <nav className="navbar navbar-expand navbar-dark px-3">
        <i
          className="navbar-brand bi bi-justify-left fs-5"
          onClick={onToggle}
        ></i>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="navbar-brand bi bi-justify-right fs-5"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle navbar_icon fs-5"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Setting
                  </a>
                </li>
                <li onClick={handelLogout}>
                  <a className="dropdown-item">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
