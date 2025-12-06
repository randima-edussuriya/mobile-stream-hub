import { useState } from "react";
import SendVerifyOtp from "../../components/StaffRegister/SendVerifyOtp";
import VerifyOtp from "../../components/StaffRegister/VerifyOtp";
import StaffRegister from "../../components/StaffRegister/StaffRegister";

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
          purpose={purpose}
          offOtpVerify={() => setOtpVerified(false)}
        />
      )}
    </>
  );
}

export default StaffRegisterFlow;
