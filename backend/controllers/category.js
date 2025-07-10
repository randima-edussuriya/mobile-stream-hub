import db from "../db.js";

export const addCategory = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const type = req.body.type?.trim();

        if (!name || !type)
            return res.json({ success: false, message: 'Fileds are required' });

        //insert category
        const sqlInsert = 'INSERT INTO category (`category_name`, `category_type`) VALUES (?,?)';
        const values = [name, type]
        // await db.query(sqlInsert, values);
        return res.json({ success: true, message: 'Category added successfully' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: 'Failed to add category. Please try again.' });
    }
}

export const getCategories = async () => {
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