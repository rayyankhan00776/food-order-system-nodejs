import express from 'express';
import clientRouter from './routes/client.route.js';

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', clientRouter);


export default app;