import db from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        //Trimming
        const email = req.body.email?.trim();
        const password = req.body.password?.trim();

        //check empty
        if (!email || !password)
            return res.json({ success: false, message: 'Fields are required' })

        //check user exist
        const sql = `
            SELECT s.*, st.staff_type_name
            FROM staff s
            INNER JOIN staff_type st ON st.staff_type_id=s.staff_type_id
            WHERE s.email=?
            LIMIT 1;
        `;
        const result = await db.query(sql, [email]);
        if (result.length === 0)
            return res.json({ success: false, message: 'User does not exist' })

        //check hash password
        const isPasswordCorrect = await bcrypt.compare(password, result[0].password);
        if (!isPasswordCorrect)
            return res.json({ success: false, message: 'Incorrect password' });

        //create jwt
        const token = jwt.sign({ id: result[0].staff_id }, process.env.JWT_SECRET);

        //create cookie
        const userLogged = { id: result[0].staff_id, name: result[0].first_name, role: result[0].staff_type_name }
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        })
        res.json({ success: true, message: 'Logged in successfully', data: userLogged })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to login' })
    }
}

export const logout = (req, res) => {
    res.clearCookie('access_token', {
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production'
    })
    res.json({ success: true, message: 'Logout Successfully' })
}