import express from 'express';
import { consoleLogger, fileLogger } from './src/middleware/morgan.middleware.js';

import expressProxy from 'express-http-proxy';

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

const CLIENT_SERVICE_URL = process.env.CLIENT_SERVICE_URL ?? 'http://localhost:3001';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL ?? 'http://localhost:3002';
const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL ?? 'http://localhost:3003';

app.use(consoleLogger);
app.use(fileLogger);
app.use('/v1/api/client', expressProxy(CLIENT_SERVICE_URL));
app.use('/v1/api/restaurant', expressProxy(RESTAURANT_SERVICE_URL));
app.use('/v1/api/orders', expressProxy(ORDERS_SERVICE_URL));

app.get("/", (req, res) => {
    res.send("Welcome to the API Gateway of the Food Order System!");
})

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT} 🟢`);
});

export default app;