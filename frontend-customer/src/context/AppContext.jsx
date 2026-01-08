import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  //get user authentication
  const getUserAuthState = async () => {
    try {
      if (!backendUrl) {
        console.warn("VITE_BACKEND_URL is missing.");
        setIsLoggedIn(false);
        return;
      }

      await axios.get(`${backendUrl}/api/customer/auth/is-authenticated`);
      setIsLoggedIn(true);
      await getUserData();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        // Expected when the user is not logged in – don't toast
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong, Please try again later"
        );
        console.error(error);
      }
    } finally {
      setAuthChecked(true);
    }
  };

  // get user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/users/me/basic`
      );
      setUserData(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, Please try again later"
      );
      console.error(error);
    }
  };

  // fetch cart item count
  const fetchCartItemCount = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/cart/total-items`
      );
      setCartItemCount(data.data.totalQuantity);
    } catch (error) {
      // Silently fail if user is not logged in or cart is empty
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    getUserAuthState();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItemCount();
    }
  }, [isLoggedIn]);

  const value = {
    backendUrl,
    isLoggedIn,
    authChecked,
    setIsLoggedIn,
    getUserData,
    setUserData,
    cartItemCount,
    fetchCartItemCount,
  };
  return (
    <AppContext.Provider value={value}>
      {authChecked ? children : <Loader fullScreen />}
    </AppContext.Provider>
  );
};
