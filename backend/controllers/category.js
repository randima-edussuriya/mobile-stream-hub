import db from "../db";

export const addCategory=()=>{
    
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