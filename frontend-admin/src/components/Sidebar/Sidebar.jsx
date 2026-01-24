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
      <div className="p-2 pb-0 bg-primary-subtle sticky-top text-center">
        <Link to={"/home"}>
          <img src={logo} alt="logo" width={160} className="img-fluid" />
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
          <span className="small fw-semibold">Staff Management</span>
        </NavLink>
        <NavLink
          to={"/customer-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-people fs-5 me-3"></i>
          <span className="small fw-semibold">Customer Management</span>
        </NavLink>
        <NavLink
          to={"/category-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-bookmarks fs-5 me-3"></i>
          <span className="small fw-semibold">Category Management</span>
        </NavLink>
        <NavLink
          to={"/item-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-diagram-3 fs-5 me-3"></i>
          <span className="small fw-semibold">Item Management</span>
        </NavLink>
        <NavLink
          to={"/supplier-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-person-gear fs-5 me-3"></i>
          <span className="small fw-semibold">Supplier Management</span>
        </NavLink>
        <NavLink
          to={"/order-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-border-all fs-5 me-3"></i>
          <span className="small fw-semibold">Order Management</span>
        </NavLink>
        <NavLink
          to={"/order-cancellation"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi-x-octagon fs-5 me-3"></i>
          <span className="small fw-semibold">Order Cancellation</span>
        </NavLink>
        <NavLink
          to={"/delivery-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-truck fs-5 me-3"></i>
          <span className="small fw-semibold">Delivery Management</span>
        </NavLink>
        <NavLink
          to={"/repair-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-sliders2-vertical fs-5 me-3"></i>
          <span className="small fw-semibold">Repair Management</span>
        </NavLink>
        <NavLink
          to={"/reorder-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-arrow-clockwise fs-5 me-3"></i>
          <span className="small fw-semibold">Reorder Management</span>
        </NavLink>
        {/* <NavLink
          to={"/day-off-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-calendar-day fs-5 me-3"></i>
          <span className="small fw-semibold">Day off Management</span>
        </NavLink> */}
        {/* <NavLink
          to={"/loyalty-program-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-cursor fs-5 me-3"></i>
          <span className="small fw-semibold">Loyalty Program Management</span>
        </NavLink> */}
        <NavLink
          to={"/feedback-rating-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-star fs-5 me-3"></i>
          <span className="small fw-semibold">
            Feedback and rating Management
          </span>
        </NavLink>
        {/* <NavLink
          to={"/customer-support-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-telephone-forward fs-5 me-3"></i>
          <span className="small fw-semibold">Customer Support Management</span>
        </NavLink> */}
        <NavLink
          to={"/reports-management"}
          className={({ isActive }) =>
            `list-group-item py-2 rounded${isActive ? " active_link" : ""}`
          }
        >
          <i className="bi bi-flag fs-5 me-3"></i>
          <span className="small fw-semibold">Reports Management</span>
        </NavLink>
      </div>
    </>
  );
}

export default Sidebar;
