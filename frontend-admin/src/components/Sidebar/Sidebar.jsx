import logo from "../../assets/icons/logo.png";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <>
      {/* ----------------------------------------------------
                            logo section
                -------------------------------------------------------- */}
      <div className="p-2 pb-0 bg-primary-subtle sticky-top">
        <Link to={"/home"}>
          <img src={logo} alt="logo" className="img-fluid" />
        </Link>
        <hr className="text-dark" />
      </div>
      {/* ----------------------------------------------------
                            Menu items section
                -------------------------------------------------------- */}
      <div className="list-group pb-5">
        <NavLink
          to={"/staff-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-person-gear fs-5 me-3"></i>
          <span>Staff Management</span>
        </NavLink>
        <NavLink
          to={"/customer-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-people fs-5 me-3"></i>
          <span>Customer Management</span>
        </NavLink>
        <NavLink
          to={"/category-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-bookmarks fs-5 me-3"></i>
          <span>Category Management</span>
        </NavLink>
        <NavLink
          to={"/item-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-diagram-3 fs-5 me-3"></i>
          <span>Item Management</span>
        </NavLink>
        <NavLink
          to={"/order-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-border-all fs-5 me-3"></i>
          <span>Order Management</span>
        </NavLink>
        <NavLink
          to={"/delivery-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-truck fs-5 me-3"></i>
          <span>Delivery Management</span>
        </NavLink>
        <NavLink
          to={"/repair-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-sliders2-vertical fs-5 me-3"></i>
          <span>Repair Management</span>
        </NavLink>
        <NavLink
          to={"/reorder-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-arrow-clockwise fs-5 me-3"></i>
          <span>Reorder Management</span>
        </NavLink>
        <NavLink
          to={"/day-off-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-calendar-day fs-5 me-3"></i>
          <span>Day off Management</span>
        </NavLink>
        <NavLink
          to={"/loyalty-program-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-cursor fs-5 me-3"></i>
          <span>Loyalty Program Management</span>
        </NavLink>
        <NavLink
          to={"/feedback-rating-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-star fs-5 me-3"></i>
          <span>Feedback and rating Management</span>
        </NavLink>
        <NavLink
          to={"/customer-support-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-telephone-forward fs-5 me-3"></i>
          <span>Customer Support Management</span>
        </NavLink>
        <NavLink
          to={"/reports-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-flag fs-5 me-3"></i>
          <span>Reports Management</span>
        </NavLink>
      </div>
    </>
  );
}

export default Sidebar;
