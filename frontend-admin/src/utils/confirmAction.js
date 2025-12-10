import Swal from "sweetalert2";

export const confirmAction = async (
  title = "Are you sure?",
  confirmButtonText = "Yes, Continue"
) => {
  return await Swal.fire({
    customClass: {
      confirmButton: "btn btn_main_dark",
      cancelButton: "btn btn-outline-danger border-2 fw-semibold",
      title: "h5",
    },
    title,
    showCancelButton: true,
    confirmButtonText,
  });
};
