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
          path: "profile",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "products/:itemId",
          element: <ProductDetails />,
        },
        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "contact-us",
          element: <ContactUs />,
        },
        {
          path: "cart",
          element: (
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Cart />
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
