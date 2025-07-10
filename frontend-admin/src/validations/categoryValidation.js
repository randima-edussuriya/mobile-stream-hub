const categoryValidation = (formData) => {
    const errors = {};

    //Trimming
    const categoryName = formData.categoryName.trim();
    const categoryType = formData.categoryType.trim();

    //check empty
    if (!categoryName) errors.categoryName = 'Category name is required';
    if (!categoryType) errors.categoryType = 'Category type is required';

    return errors;
}
export default categoryValidation;