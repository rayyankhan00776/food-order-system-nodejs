import express from 'express';

const restaurantRouter = express.Router();

restaurantRouter.get('/welcome', (req, res) => {
    res.send('Welcome to the restaurant API!');
});
export default restaurantRouter;