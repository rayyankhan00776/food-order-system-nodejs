import express from 'express';
import clientRouter from './routes/client.route.js';
import cookieParser from 'cookie-parser';
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', clientRouter);


export default app;