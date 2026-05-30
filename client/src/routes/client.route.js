import express from 'express';
import { getToOrder, logoutClient, getClientInfo, getRestuarantMenu } from '../controllers/client.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const clientRouter = express.Router();

clientRouter.get('/welcome', (req, res) => {
    res.send('Welcome to WeMadeIt cuisine!');
});

clientRouter.post("/register-login", getToOrder);

clientRouter.get("/logout", authMiddleware, logoutClient);

clientRouter.get("/profile", authMiddleware, getClientInfo);

clientRouter.get("/getMenu", authMiddleware, getRestuarantMenu)


export default clientRouter;