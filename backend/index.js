import express from 'express';
import cors from 'cors';
import authRoutes from './routes/customer/auth.js';
import cookieParser from 'cookie-parser';
import 'dotenv/config'

const app = express();
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//customer routes
app.use('/api/auth', authRoutes);

const server = app.listen(process.env.PORT, process.env.SERVER_HOST, () => {
    console.log('Server is listning to port ' + server.address().port);
})