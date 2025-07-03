import React from 'react'

function LoginValidation(values) {
    const errors = {};

    //Trimming
    const email = values.email.trim();
    const password = values.password.trim();

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    return errors;
}

export default LoginValidation