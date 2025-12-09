import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const useUserAction = (backendUrl) => {
  const handleStatusChange = async (userType, userId, isActive, callback) => {
    const actionText = isActive ? "activate" : "deactivate";

    const confirm = await Swal.fire({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        title: "h5",
      },
      title: `Are you sure to  ${actionText} this user?`,
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confirm.isConfirmed) return;

    try {
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
