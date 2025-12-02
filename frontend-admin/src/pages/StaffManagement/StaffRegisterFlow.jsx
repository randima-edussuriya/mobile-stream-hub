import { useState } from "react";
import SendVerifyOtp from "./SendVerifyOtp";
import VerifyOtp from "./VerifyOtp";
import StaffRegister from "./StaffRegister";

function StaffRegisterFlow() {
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const purpose = "staff_registration";
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
        <StaffRegister
          email={email}
          offOtpVerify={() => setOtpVerified(false)}
        />
      )}
    </>
  );
}

export default StaffRegisterFlow;
