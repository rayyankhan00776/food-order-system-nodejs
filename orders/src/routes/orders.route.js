import express from 'express';

const orderRouter = express.Router();

orderRouter.get('/welcome', (req, res) => {
    res.send('Welcome to the order API!');
});
export default orderRouter;