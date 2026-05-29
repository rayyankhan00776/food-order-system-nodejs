import express from 'express';
import { getToOrder } from '../controllers/client.controller.js';
const clientRouter = express.Router();

clientRouter.get('/welcome', (req, res) => {
    res.send('Welcome to WeMadeIt cuisine!');
});

clientRouter.post('/register-login', getToOrder);


export default clientRouter;