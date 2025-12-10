import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const VerifyOtp = ({ email, purpose, onOtpVerify }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(30);

  const { backendUrl } = useContext(AppContext);

  // Countdown Timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP Input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next box
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Check if all OTP fields are filled
  const isOtpFilled = otp.every((digit) => digit !== "");

  const handleVerify = async (otp) => {
    try {
      // API call to verify OTP
      await axios.post(`${backendUrl}/api/shared/auth/verify-otp`, {
        email,
        otp,
        purpose,
      });
      toast.success("OTP verified successfully");
      onOtpVerify();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    setTimer(30);
    setOtp(Array(6).fill(""));
    inputsRef.current[0].focus();
    try {
      // Simulate API call
      await axios.post(`${backendUrl}/api/shared/auth/send-verify-otp`, {
        email,
        purpose,
      });
      toast.success("OTP resent successfully");
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
        className="col-10 col-sm-4 p-3 rounded bg-secondary-subtle shadow"
        style={{ marginTop: "180px" }}
      >
        <h3 className="text-center mb-3">Step 2 - Staff User Register</h3>

        <p className="text-center text-muted mb-3">
          Enter the 6-digit code sent to your email.
        </p>

        {/* OTP INPUTS */}
        <Row className="g-2 justify-content-center mb-4">
          {otp.map((digit, index) => (
            <Col key={index} xs={2}>
              <Form.Control
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="text-center fs-4 fw-medium"
              />
            </Col>
          ))}
        </Row>

        <div className="d-flex justify-content-between gap-3">
          {/* VERIFY BUTTON */}
          <Button
            className="btn_main_dark shadow"
            disabled={!isOtpFilled}
            onClick={() => handleVerify(otp.join(""))}
          >
            Verify OTP
          </Button>

          {/* RESEND SECTION */}
          <div className="d-flex align-items-center">
            {timer > 0 ? (
              <span className="text-muted">
                Resend available in <strong>{timer}s</strong>
              </span>
            ) : (
              <Button variant="link" className="px-0" onClick={handleResend}>
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default VerifyOtp;
