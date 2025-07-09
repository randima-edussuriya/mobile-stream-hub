import React from 'react'

const loginValidation = (formData) => {
    const errors = {};

    //Trimming
    const email = formData.email.trim();
    const password = formData.password.trim();

    //check empty
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    return errors;
}

export default loginValidation