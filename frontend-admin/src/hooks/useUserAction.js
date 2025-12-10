import axios from "axios";
import { toast } from "react-toastify";
import { confirmAction } from "../utils/confirmAction";

export const useUserAction = (backendUrl) => {
  const handleStatusChange = async (userType, userId, isActive, callback) => {
    // Confirm action
    const confirmTitle = `Are you sure, to ${
      isActive ? "activate" : "deactivate"
    } this user?`;
    const result = await confirmAction(confirmTitle);
    if (!result.isConfirmed) return;

    try {
      // Update user status based on userType
      if (userType === "customer") {
        await axios.put(`${backendUrl}/api/admin/customers/${userId}/status`, {
          isActive,
        });
      }

      if (userType === "staff") {
        await axios.put(
          `${backendUrl}/api/admin/staff-users/${userId}/status`,
          { isActive }
        );
      }
      if (callback) callback();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  return {
    handleStatusChange,
  };
};
