import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ResetPasswordForm({ email, purpose, offOtpVerify }) {
  const [newPassword, setNewPassword] = useState("");

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/customer/auth/reset-password`,
        {
          email,
          purpose,
          newPassword,
        }
      );
      toast.success(data.message);
      offOtpVerify();
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center mt-5 py-3"
    >
      <Container className="col-10 col-sm-4 p-3 bg_light rounded-2 shadow">
        <h3 className="text-center">Reset Password</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          {/* --------------------------------------------------------------
                                buttons section
                    ------------------------------------------------------------------- */}
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <Button
              variant="none"
              className="btn_main_dark me-3 shadow"
              type="submit"
            >
              Reset Password
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default ResetPasswordForm;
