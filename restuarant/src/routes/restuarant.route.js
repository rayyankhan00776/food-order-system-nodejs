import express from 'express';
import { createMenu, getMenu, updateMenu, deleteMenu, getMenuItem } from '../controllers/restuarant.controller.js';
const restaurantRouter = express.Router();

restaurantRouter.get('/welcome', (req, res) => {
    res.send('Welcome to the WeMadeIt restaurant!');
});

restaurantRouter.post("/menu/create", createMenu);
restaurantRouter.get("/menu", getMenu);
restaurantRouter.get("/menu/:id", getMenuItem);
restaurantRouter.put("/menu/:id", updateMenu);
restaurantRouter.delete("/menu/:id", deleteMenu);

export default restaurantRouter;