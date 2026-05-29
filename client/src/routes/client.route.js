import express from 'express';

const clientRouter = express.Router();

clientRouter.get('/welcome', (req, res) => {
    res.send('Welcome to the client API!');
});

export default clientRouter;