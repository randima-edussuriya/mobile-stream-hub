import { useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

function Signup({ onEmail, purpose }) {
  const [email, setEmail] = useState("");

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* ----------------------------------------------------------------------
                Handle form submit
    ------------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to send OTP to the email
      await axios.post(`${backendUrl}/api/shared/auth/send-verify-otp`, {
        email,
        purpose,
      });
      toast.success("OTP sent to email successfully");
      onEmail(email);
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
      className="d-flex justify-content-center align-items-center  mt-5 py-3"
    >
      <Container className="col-10 col-sm-5 p-3 bg_light rounded-2 shadow">
        <h3 className="text-center">Step 1 - Request Verification</h3>
        <p className="text-muted mb-3">
          Please enter your email address to receive a verification OTP.
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            placeholder="Enter email"
            name="email"
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* --------------------------------------------------------------
                                buttons, link section
                    ------------------------------------------------------------------- */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Send Verification OTP
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="px-0"
            >
              Already have an account? Log In
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default Signup;
