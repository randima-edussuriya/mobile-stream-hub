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
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import DeliveryManagement from "./pages/DeliveryManagement";
import DayOffManagement from "./pages/DayOffManagement/DayOffManagement";
import LoyaltyProgramManagement from "./pages/LoyaltyProgramManagement";
import FeedbackRatingManagement from "./pages/FeedbackRatingManagement";
import CustomerSupportManagement from "./pages/CustomerSupportManagement";
import ReportsManagement from "./pages/ReportsManagement";
import RepairManagement from "./pages/RepairManagement/RepairManagement";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import { AppContext } from "./context/AppContext";
import StaffRegisterFlow from "./pages/StaffManagement/StaffRegisterFlow";
import StaffProfile from "./pages/StaffManagement/StaffProfile";
import Profile from "./pages/Profile";
import ErrorProvider from "./pages/ErrorProvider";
import CategoryProfile from "./pages/CategoryManagement/CategoryProfile";
import CategoryAdd from "./pages/CategoryManagement/CategoryAdd";
import ItemManagement from "./pages/ItemManagement/ItemManagement";
import ItemProfile from "./pages/ItemManagement/ItemProfile";
import ItemAdd from "./pages/ItemManagement/ItemAdd";
import OrderProfile from "./pages/OrderManagement/OrderProfile";
import OrderCancellation from "./pages/OrderCancellation";
import RepairRequestProfile from "./pages/RepairManagement/RepairRequestProfile";
import AcceptRequest from "./pages/RepairManagement/AcceptRequest";
import RepairsListing from "./pages/RepairManagement/RepairsListing";
import RepairProfile from "./pages/RepairManagement/RepairProfile";
import SupplierManagement from "./pages/SupplierManagement/SupplierManagement";
import SupplierProfile from "./pages/SupplierManagement/SupplierProfile";
import ReOrder from "./pages/ItemManagement/ReOrder";
import SupplierAdd from "./pages/SupplierManagement/SupplierAdd";
import DayOffProfile from "./pages/DayOffManagement/DayOffProfile";
import DayOffAdd from "./pages/DayOffManagement/DayOffAdd";
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";
import LeaveProfile from "./pages/LeaveManagement/LeaveProfile";
import LeaveAdd from "./pages/LeaveManagement/LeaveAdd";

function App() {
  const [toggle, setToggle] = useState(false);

  const { authChecked, isLoggedIn, userData } = useContext(AppContext);

  const Layout = () => {
    return (
      <div className="container-fluid bg-secondary min-vh-100">
        <div className="row">
          {!toggle && (
            <div className="col-4 col-md-3 col-lg-2 bg-primary-subtle vh-100 overflow-y-auto">
              <Sidebar />
            </div>
          )}
          <div
            className={`${
              toggle ? "col" : "col-8 col-md-9 col-lg-10 vh-100 overflow-y-auto"
            } px-0`}
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
      errorElement: <ErrorProvider errorMessage="Page Not Found" />,
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
          path: "profile",
          element: <Profile />,
        },
        /*--------------------------------------------------------
              staff-management routes
        ---------------------------------------------------------- */
        {
          path: "staff-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <Outlet />
            </RoleRoute>
          ),
          children: [
            {
              path: "",
              element: <StaffManagement />,
            },
            {
              path: "register",
              element: <StaffRegisterFlow />,
            },
            {
              path: "profile/:staffId",
              element: <StaffProfile />,
            },
          ],
        },
        /*--------------------------------------------------------
              customer-management routes
        ---------------------------------------------------------- */
        {
          path: "customer-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <CustomerManagement />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              category-management routes
        ---------------------------------------------------------- */
        {
          path: "category-management",
          element: <Outlet />,
          children: [
            {
              path: "",
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={[
                    "admin",
                    "inventory manager",
                    "cashier",
                    "technician",
                  ]}
                >
                  <CategoryManagement />
                </RoleRoute>
              ),
            },
            {
              path: "profile/:categoryId",
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={[
                    "admin",
                    "inventory manager",
                    "cashier",
                    "technician",
                  ]}
                >
                  <CategoryProfile />
                </RoleRoute>
              ),
            },
            {
              path: "add",
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={["admin", "inventory manager"]}
                >
                  <CategoryAdd />
                </RoleRoute>
              ),
            },
          ],
        },
        /*--------------------------------------------------------
              item-management routes
        ---------------------------------------------------------- */
        {
          path: "item-management",
          element: <Outlet />,
          children: [
            {
              path: "", // base path: /item-management
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={[
                    "admin",
                    "inventory manager",
                    "cashier",
                    "technician",
                  ]}
                >
                  <ItemManagement />
                </RoleRoute>
              ),
            },
            {
              path: "profile/:itemId", // base path: /item-management/profile/:itemId
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={[
                    "admin",
                    "inventory manager",
                    "cashier",
                    "technician",
                  ]}
                >
                  <ItemProfile />
                </RoleRoute>
              ),
            },
            {
              path: "add", // base path: /item-management/add
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={["admin", "inventory manager"]}
                >
                  <ItemAdd />
                </RoleRoute>
              ),
            },
            {
              path: "reorder/:itemId", // base path: /item-management/reorder/:itemId
              element: (
                <RoleRoute
                  userData={userData}
                  allowedRoles={["admin", "inventory manager"]}
                >
                  <ReOrder />
                </RoleRoute>
              ),
            },
          ],
        },

        /*--------------------------------------------------------
              supplier-management routes
        ---------------------------------------------------------- */
        {
          path: "supplier-management",
          element: (
            <RoleRoute
              userData={userData}
              allowedRoles={["admin", "inventory manager"]}
            >
              <Outlet />
            </RoleRoute>
          ),
          children: [
            {
              path: "", // base path: /supplier-management
              element: <SupplierManagement />,
            },
            {
              path: "profile/:supplierId", // base path: /supplier-management/profile/:supplierId
              element: <SupplierProfile />,
            },
            {
              path: "add", // base path: /supplier-management/add
              element: <SupplierAdd />,
            },
          ],
        },

        /*--------------------------------------------------------
              order-management routes
        ---------------------------------------------------------- */
        {
          path: "order-management",
          element: (
            <RoleRoute
              userData={userData}
              allowedRoles={["admin", "cashier", "deliver person"]}
            >
              <Outlet />
            </RoleRoute>
          ),
          children: [
            {
              path: "",
              element: <OrderManagement />,
            },
            {
              path: "profile/:orderId",
              element: <OrderProfile />,
            },
          ],
        },
        /*--------------------------------------------------------
              order-cancellation routes
        ---------------------------------------------------------- */
        {
          path: "order-cancellation",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin", "cashier"]}>
              <OrderCancellation />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              delivery-management routes
        ---------------------------------------------------------- */
        {
          path: "delivery-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <DeliveryManagement />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              repair-management routes
        ---------------------------------------------------------- */
        {
          path: "repair-management",
          element: (
            <RoleRoute
              userData={userData}
              allowedRoles={["admin", "technician"]}
            >
              <Outlet />
            </RoleRoute>
          ),
          children: [
            {
              path: "", // base path: /repair-management
              element: <RepairManagement />,
            },
            {
              path: "request-profile/:requestId", // base path: /repair-management/profile/:requestId
              element: <RepairRequestProfile />,
            },
            {
              path: "accept-request/:requestId", // base path: /repair-management/accept-request/:requestId
              element: <AcceptRequest />,
            },
            {
              path: "repairs-listing", // base path: /repair-management/repairs-listing
              element: <RepairsListing />,
            },
            {
              path: "repair-profile/:repairId", // base path: /repair-management/repair-profile/:repairId
              element: <RepairProfile />,
            },
          ],
        },

        /*--------------------------------------------------------
              day-off-management routes
        ---------------------------------------------------------- */
        {
          path: "day-off-management",
          element: <Outlet />,
          children: [
            {
              path: "", // base path: /day-off-management
              element: <DayOffManagement />,
            },
            {
              path: "profile/:dayOffId", // base path: /day-off-management/profile/:dayOffId
              element: <DayOffProfile />,
            },
            {
              path: "add", // base path: /day-off-management/add
              element: (
                <RoleRoute userData={userData} allowedRoles={["admin"]}>
                  <DayOffAdd />
                </RoleRoute>
              ),
            },
          ],
        },
        /*--------------------------------------------------------
              leave-management routes
        ---------------------------------------------------------- */
        {
          path: "leave-management",
          element: <Outlet />,
          children: [
            {
              path: "",
              element: <LeaveManagement />,
            },
            {
              path: "profile/:leaveId",
              element: <LeaveProfile />,
            },
            {
              path: "add",
              element: <LeaveAdd />,
            },
          ],
        },
        /*--------------------------------------------------------
              loyalty-program-management routes
        ---------------------------------------------------------- */
        {
          path: "loyalty-program-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <LoyaltyProgramManagement />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              feedback-rating-management routes
        ---------------------------------------------------------- */
        {
          path: "feedback-rating-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <FeedbackRatingManagement />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              customer-support-management routes
        ---------------------------------------------------------- */
        {
          path: "customer-support-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <CustomerSupportManagement />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              reports-management routes
        ---------------------------------------------------------- */
        {
          path: "reports-management",
          element: (
            <RoleRoute userData={userData} allowedRoles={["admin"]}>
              <ReportsManagement />
            </RoleRoute>
          ),
        },
        /*--------------------------------------------------------
              unauthorized routes
        ---------------------------------------------------------- */
        {
          path: "unauthorized",
          element: <ErrorProvider errorMessage="Access Denied" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
