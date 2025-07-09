const staffRegisterValidation = (formData) => {
    const errors = {};

    //Trimming
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const phoneNo = formData.phoneNo.trim();
    const nicNo = formData.nicNo.trim();
    const address = formData.address.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    //check empty
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!address) errors.address = 'Address is required';

    //phoneNo validation
    if (!phoneNo) {
        errors.phoneNo = 'Phone number is required';
    } else if (!/^(0)\d{9}$/.test(phoneNo)) {
        errors.phoneNo = 'Invalid phone number'
    }

    //nic No validation
    const isNicValid = (nicNo) => {

        const oldNicPattern = /^[0-9]{9}[vV]$/;
        const newNicPattern = /^[0-9]{12}$/;

        return oldNicPattern.test(nicNo) || newNicPattern.test(nicNo);
    }
    if (!nicNo) {
        errors.nicNo = 'NIC number is required';
    } else if (!isNicValid(nicNo)) {
        errors.nicNo = 'Invalid NIC number';
    }

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
export default staffRegisterValidation;