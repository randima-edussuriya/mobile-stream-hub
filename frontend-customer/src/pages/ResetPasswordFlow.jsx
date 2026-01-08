import { useState } from "react";
import SendVerifyOtp from "../components/otpVerification/SendVerifyOtp";
import VerifyOtp from "../components/otpVerification/VerifyOtp";
import ResetPasswordForm from "../components/ResetPasswordForm";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const purpose = "customer_password_reset";
  return (
    <>
      {!email && (
        <SendVerifyOtp onEmail={(e) => setEmail(e)} purpose={purpose} />
      )}
      {email && !otpVerified && (
        <VerifyOtp
          email={email}
          purpose={purpose}
          onOtpVerify={() => setOtpVerified(true)}
        />
      )}
      {email && otpVerified && (
        <ResetPasswordForm
          email={email}
          purpose={purpose}
          offOtpVerify={() => setOtpVerified(false)}
        />
      )}
    </>
  );
}

export default ResetPassword;
