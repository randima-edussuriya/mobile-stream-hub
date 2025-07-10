const categoryValidation = (formData) => {
    const errors = {};

    //Trimming
    const name = formData.name.trim();
    const type = formData.type.trim();

    //check empty
    if (!name) errors.name = 'Category name is required';
    if (!type) errors.type = 'Category type is required';

    return errors;
}
export default categoryValidation;