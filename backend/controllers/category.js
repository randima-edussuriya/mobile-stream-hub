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

export const getcategoriesPhone = async (req, res) => {
    try {
        const sql = "SELECT * FROM category WHERE category_type = 'phone'";
        const result = await db.query(sql);
        res.json({ success: true, date: result })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to get categories in phone' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        //validate category ID
        const categoryId = req.params.id?.trim();
        if (!categoryId || isNaN(categoryId))
            return res.json({ success: false, message: 'Missing or invalid category ID' })

        const sql = 'DELETE FROM category WHERE category_id=?';

        //delete category from db
        await db.query(sql, [categoryId]);
        return res.json({ success: true, message: 'Category is deleted successfully.' })
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'Failed to delete category. Please try again' })
    }
}