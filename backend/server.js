import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import adminAuthRoutes from './routes/auth/adminAuth.js'
import customerAuthRoutes from './routes/auth/customerAuth.js'
import customerRoutes from './routes/customer.js'
import staffTypeRoutes from './routes/staffType.js'
import staffUserRoutes from './routes/staffUser.js'
import categoryRoutes from './routes/category.js'

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

//auth routes
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/auth/customer', customerAuthRoutes);

app.use('/api/customer', customerRoutes);
app.use('/api/staff_type', staffTypeRoutes);
app.use('/api/staff_user', staffUserRoutes);
app.use('/api/category', categoryRoutes);

//for test
app.get('/test', async (req, res) => {
    res.json('Testin happening')
    const secure = process.env.NODE_ENV === 'development';
    console.log(secure);
})


const server = app.listen(process.env.PORT, process.env.SERVER_HOST, () => {
    console.log('Server is listning to port ' + server.address().port);
})