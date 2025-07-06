import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import adminAuthRoutes from './routes/auth/adminAuth.js'
import customerAuthRoutes from './routes/auth/customerAuth.js'

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

//Admin routs
app.use('/api/admin/customer', adminCustomerRoutes);

//auth routes
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/auth/customer', customerAuthRoutes);

//for test
import bcrypt, { hash } from 'bcryptjs';
app.get('/test', async (req, res) => {
    res.json('Testin happening')
    const pwd = 'aA1@adre'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);
    console.log(hashedPassword);
    const isPasswordCorrect = await bcrypt.compare(pwd, '$2b$10$dCTRu3vlb5HpnSDq5MQMneG/8sfjO63cTzNKPwiftmuxY9U7wvlQ6')
    if (isPasswordCorrect) console.log('Password correct')
})


const server = app.listen(process.env.PORT, process.env.SERVER_HOST, () => {
    console.log('Server is listning to port ' + server.address().port);
})