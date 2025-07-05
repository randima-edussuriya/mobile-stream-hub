import express from 'express';
import cors from 'cors';
import customerAuthRoutes from './routes/customer/auth.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'

const app = express();
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
dotenv.config();


//customer routes
app.use('/api/customer/auth', customerAuthRoutes);


const server = app.listen(process.env.PORT, process.env.SERVER_HOST, () => {
    console.log('Server is listning to port ' + server.address().port);
})