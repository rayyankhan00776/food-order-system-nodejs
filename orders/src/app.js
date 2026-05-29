import express from 'express';
import orderRouter from './routes/orders.route.js';

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', orderRouter);

export default app;