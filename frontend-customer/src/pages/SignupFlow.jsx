import { useState } from "react";
import SendVerifyOtp from "../components/otpVerification/SendVerifyOtp";
import VerifyOtp from "../components/otpVerification/VerifyOtp";
import Signup from "../components/Signup";

function SignupFlow() {
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const purpose = "customer_registration";
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
        <Signup
          email={email}
          purpose={purpose}
          offOtpVerify={() => setOtpVerified(false)}
        />
      )}
    </>
  );
}

export default SignupFlow;
