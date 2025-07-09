import db from "../db.js";

export const getStaffUsers = async (req, res) => {
    try {
        const sql = `SELECT s.staff_id, s.first_name, s.last_name, s.email, s.is_active, s.phone_number, s.hire_date, s.nic_number, s.address, st.staff_type_name
                    FROM staff s
                    INNER JOIN staff_type st ON st.staff_type_id=s.staff_type_id`;
        const result = await db.query(sql)
        res.json({ success: true, data: result })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to fetch staff users. Please try again.' })
    }
}