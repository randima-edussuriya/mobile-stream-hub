import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import { useContext, useState } from "react";
import Navbar from "./components/Navbar";
import StaffManagement from "./pages/StaffManagement/StaffManagement";
import { PrivateRoute, RoleRoute } from "./routes/authRoutes";
import Login from "./pages/Login";
import CustomerManagement from "./pages/CustomerManagement";
import ItemManagement from "./pages/ItemManagement";
import OrderManagement from "./pages/OrderManagement";
import DeliveryManagement from "./pages/DeliveryManagement";
import ReorderManagement from "./pages/ReorderManagement";
import DayOffManagement from "./pages/DayOffManagement";
import LoyaltyProgramManagement from "./pages/LoyaltyProgramManagement";
import FeedbackRatingManagement from "./pages/FeedbackRatingManagement";
import CustomerSupportManagement from "./pages/CustomerSupportManagement";
import ReportsManagement from "./pages/ReportsManagement";
import RepairManagement from "./pages/RepairManagement";
import CategoryAdd from "./pages/CategoryManagement/CategoryAdd";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import { AppContext } from "./context/AppContext";
import StaffRegisterFlow from "./pages/StaffManagement/StaffRegisterFlow";

function App() {
  const [toggle, setToggle] = useState(false);

  const { authChecked, isLoggedIn, userData } = useContext(AppContext);

  const Layout = () => {
    return (
      <div className="container-fluid bg-dark min-vh-100">
        <div className="row">
          {!toggle && (
            <div className="col-4 col-md-3 col-lg-2 bg-primary-subtle vh-100 overflow-y-auto">
              <Sidebar />
            </div>
          )}
          <div
            className={`${
              toggle ? "col" : "col-8 col-md-9 col-lg-10 vh-100 overflow-y-auto"
            } `}
          >
            <Navbar
              onToggle={() => {
                setToggle((pre) => !pre);
              }}
            />
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "",
      element: <Login />,
      errorElement: <div className="text-danger">Not Found: Invalid URL</div>,
    },
    {
      path: "",
      element: (
        <PrivateRoute authChecked={authChecked} isLoggedIn={isLoggedIn}>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "staff-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <StaffManagement />
            </RoleRoute>
          ),
        },
        {
          path: "staff-register",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <StaffRegisterFlow />
            </RoleRoute>
          ),
        },
        {
          path: "customer-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <CustomerManagement />
            </RoleRoute>
          ),
        },
        {
          path: "category-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <CategoryManagement />
            </RoleRoute>
          ),
        },
        {
          path: "category-add",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <CategoryAdd />
            </RoleRoute>
          ),
        },
        {
          path: "item-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <ItemManagement />
            </RoleRoute>
          ),
        },
        {
          path: "order-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <OrderManagement />
            </RoleRoute>
          ),
        },
        {
          path: "delivery-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <DeliveryManagement />
            </RoleRoute>
          ),
        },
        {
          path: "repair-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <RepairManagement />
            </RoleRoute>
          ),
        },
        {
          path: "reorder-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <ReorderManagement />
            </RoleRoute>
          ),
        },
        {
          path: "day-off-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <DayOffManagement />
            </RoleRoute>
          ),
        },
        {
          path: "loyalty-program-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <LoyaltyProgramManagement />
            </RoleRoute>
          ),
        },
        {
          path: "feedback-rating-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <FeedbackRatingManagement />
            </RoleRoute>
          ),
        },
        {
          path: "customer-support-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <CustomerSupportManagement />
            </RoleRoute>
          ),
        },
        {
          path: "reports-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <ReportsManagement />
            </RoleRoute>
          ),
        },
        {
          path: "unauthorized",
          element: <div className="text-bg-danger ps-1">Access Denied !</div>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
