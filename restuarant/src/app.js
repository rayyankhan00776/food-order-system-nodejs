import express from 'express';
import restaurantRouter from './routes/restuarant.route.js';

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', restaurantRouter);

export default app;