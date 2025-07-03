import React from 'react'

function SignupValidation(values) {
    const errors = {};

    //Trimming
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const phoneNo = values.phoneNo.trim();
    const address = values.address.trim();
    const email = values.email.trim();
    const password = values.password.trim();
    const confirmPassword = values.confirmPassword.trim();

    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!phoneNo) errors.phoneNo = 'Phone number is required';
    if (!address) errors.address = 'Address is required';

    //email validation
    if (!email) {
        errors.email = 'Email is required';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Invalid email format";
    }

    //password validation
    const passwordValidation = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
        if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
        if (!/\d/.test(password)) return 'Password must include at least one digit';
        if (!/[\W_]/.test(password)) return 'Password must include at least one special character';
        if (/\s/.test(password)) return 'Password must not contain spaces';
    };
    const passwordError = passwordValidation(password);
    if (passwordError) errors.password = passwordError;

    //confirm password
    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
    } else if (password && password !== confirmPassword) {
        errors.confirmPassword = 'Password does not match';
    }

    return errors;
}

export default SignupValidation