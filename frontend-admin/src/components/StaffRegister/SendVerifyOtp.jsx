import { useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

function SendVerifyOtp({ onEmail, purpose }) {
  const [email, setEmail] = useState("");

  const { backendUrl } = useContext(AppContext);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

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
      className="d-flex justify-content-center align-items-center"
    >
      <Container
        className="col-10 col-sm-6 p-3 rounded bg-secondary-subtle shadow"
        style={{ marginTop: "180px" }}
      >
        <h3 className="text-center mb-3">Step 1 - Staff User Register</h3>
        <Form onSubmit={handleSubmit}>
          <p className="text-muted mb-3">
            Please enter the email address of the staff user you want to
            register.
          </p>
          <Form.Control
            type="text"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
            className="mb-4"
          />
          <div>
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Send Verification OTP
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default SendVerifyOtp;
