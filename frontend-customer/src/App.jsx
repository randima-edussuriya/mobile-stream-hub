import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SignupFlow from "./pages/SignupFlow";
import Profile from "./pages/Profile";
import { PrivateRoute } from "./routes/authRoutes";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

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
          path: "cart",
          element: <Cart />,
        },
        {
          path: "coming_soon",
          element: <ComingSoon />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
