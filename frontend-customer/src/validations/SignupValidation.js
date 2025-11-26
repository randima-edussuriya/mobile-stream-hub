import React from "react";

const signupValidation = (formData) => {
  const errors = {};

  //Trimming
  const firstName = formData.firstName.trim();
  const lastName = formData.lastName.trim();
  const phoneNo = formData.phoneNo.trim();
  const address = formData.address.trim();
  const email = formData.email.trim();
  const password = formData.password.trim();
  const confirmPassword = formData.confirmPassword.trim();

  //check emppty
  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!address) errors.address = "Address is required";

  //phoneNo validation
  if (!phoneNo) {
    errors.phoneNo = "Phone number is required";
  } else if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(phoneNo)) {
    errors.phoneNo = "Invalid phone number";
  }

  //email validation
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format";
  }

  //password validation
  const passwordValidation = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password))
      return "Password must include at least one lowercase letter";
    if (!/[A-Z]/.test(password))
      return "Password must include at least one uppercase letter";
    if (!/\d/.test(password)) return "Password must include at least one digit";
    if (!/[\W]/.test(password))
      return "Password must include at least one special character";
  };
  const passwordError = passwordValidation(password);
  if (passwordError) errors.password = passwordError;

  //confirm password
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (password && password !== confirmPassword) {
    errors.confirmPassword = "Password does not match";
  }

  return errors;
};

export default signupValidation;
