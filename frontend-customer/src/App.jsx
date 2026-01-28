import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Products from "./pages/products/Products";
import ProductDetails from "./pages/products/ProductDetails";
import SignupFlow from "./pages/SignupFlow";
import Profile from "./pages/Profile";
import { PrivateRoute } from "./routes/authRoutes";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ResetPassword from "./pages/ResetPasswordFlow";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/orders/MyOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import RequestRepair from "./pages/repair/RequestRepair";
import MyRepairRequests from "./pages/repair/MyRepairRequests";
import RepairRequestProfile from "./pages/repair/RepairRequestProfile";
import MyRepairs from "./pages/repair/MyRepairs";
import RepairProfile from "./pages/repair/RepairProfile";
import Coupons from "./pages/Coupons";

const Layout = () => {
  return (
    <div className="d-flex flex-column  min-vh-100">
      <div className="flex-grow-1">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const { isLoggedIn } = useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      errorElement: <div>Not Found: Invalid URL</div>,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <SignupFlow />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "profile",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </PrivateRoute>
          ),
        },
        /* -----------------------------------------------------------------
              Product routes
        --------------------------------------------------------------------*/
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "products/:itemId",
          element: <ProductDetails />,
        },
        /* -----------------------------------------------------------------
              Static routes
        --------------------------------------------------------------------*/
        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "contact-us",
          element: <ContactUs />,
        },
        /* -----------------------------------------------------------------
              cart and order routes
        --------------------------------------------------------------------*/
        {
          path: "cart",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Cart />
            </PrivateRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Checkout />
            </PrivateRoute>
          ),
        },
        {
          path: "my-orders",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <MyOrders />
            </PrivateRoute>
          ),
        },
        {
          path: "my-orders/:orderId",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <OrderDetails />
            </PrivateRoute>
          ),
        },
        /* -----------------------------------------------------------------
              Repair routes
        --------------------------------------------------------------------*/
        {
          path: "repair",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Outlet />
            </PrivateRoute>
          ),
          children: [
            {
              path: "", // base: /repair
              element: <RequestRepair />,
            },
            {
              path: "my-requests", // base: /repair/my-requests
              element: <MyRepairRequests />,
            },
            {
              path: "my-requests/:requestId", // base: /repair/my-requests/:requestId
              element: <RepairRequestProfile />,
            },
            {
              path: "listing", // base: /repair/listing
              element: <MyRepairs />,
            },
            {
              path: ":repairId", // base: /repair/:repairId
              element: <RepairProfile />,
            },
          ],
        },
        {
          path: "coupons", // base: /coupons
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Coupons />
            </PrivateRoute>
          ),
        },
        {
          path: "coming-soon",
          element: <ComingSoon />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
