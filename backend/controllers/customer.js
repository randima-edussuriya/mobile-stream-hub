import db from '../db.js';

export const getCustomers = async (req, res) => {
    try {
        const sql = 'SELECT customer_id, first_name, last_name, email, is_active, phone_number, address, created_at FROM customer';
        const result = await db.query(sql)
        res.json({ success: true, data: result })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to fetch customers. Please try again.' })
    }
}

export const getCustomer = (req, res) => {

}

export const updateStatus = async (req, res) => {
    try {
        //req.params and req.query always returns strings. required trim
        const customerId = req.params.id?.trim();
        //req.body returns values in their original types
        const { newStatus } = req.body;

        //validate inputs
        if (!customerId || isNaN(customerId))
            return res.json({ success: false, message: 'Missing or invalid customer ID' })
        if (isNaN(newStatus) || ![0, 1].includes(newStatus))
            return res.json({ success: false, message: 'Invalid status' })

        //update db
        const sql = 'UPDATE customer SET is_active = ? WHERE customer_id = ?'
        await db.query(sql, [newStatus, customerId]);
        return res.json({ success: true, message: `Customer is ${newStatus ? 'activated' : 'deactivated'} successfully` })
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'Failed to update customer status. Please try again.....' })
    }
}