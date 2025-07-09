import db from "../db.js";

export const c = async (req, res) => {
    try {
        const sql = 'SELECT staff_id, first_name, last_name, email, is_active, phone_number, hire_date, nic_number, address FROM staff';
        const result = await db.query(sql)
        res.json({ success: true, data: result })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to fetch staff users. Please try again.' })
    }
}