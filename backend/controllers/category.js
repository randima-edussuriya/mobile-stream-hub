import db from "../db.js";

export const addCategory = async (req, res) => {
    try {
        const categoryName = req.body.categoryName?.trim();
        const categoryType = req.body.categoryType?.trim();

        if (!categoryName || !categoryType)
            return res.json({ success: false, message: 'Fileds are required' });

        //insert category
        const sqlInsert = 'INSERT INTO category (`category_name`, `category_type`) VALUES (?,?)';
        const values = [categoryName, categoryType]
        await db.query(sqlInsert, values);
        return res.json({ success: true, message: 'Category added successfully' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: 'Failed to add category. Please try again.' });
    }
}

export const getCategories = async (req, res) => {
    try {
        const sql = 'SELECT * FROM category';
        const result = await db.query(sql)
        res.json({ success: true, data: result })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to fetch categories. Please try again.' })
    }
}

export const deleteCategory = () => {

}