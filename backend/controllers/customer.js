import db from '../db.js';

export const getCustomers = async (req, res) => {
    try {
        const sql = 'SELECT customer_id, first_name, last_name, email, is_active, phone_number, address, created_at FROM customer';
        const result = await db.query(sql)
        res.json({ success: true, data: result })
    } catch (error) {
        res.json({ success: false, message: 'Failed to fetch customers' })
    }
}

export const getCustomer = (req, res) => {

}

export const deactivateCustomer = (req, res) => {
    
}