import db from "../db.js";

export const getStaffTypes = async (req, res) => {
    try {
        const sql = 'SELECT * FROM staff_type';
        const result = await db.query(sql);
        res.json({ success: true, data: result })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to fetch staff types' })
    }

}