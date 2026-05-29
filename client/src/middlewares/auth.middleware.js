import jwt from "jsonwebtoken";
import config from "../configs/config.js";
import clientModel from "../models/client.model.js";
import blacklistTokenModel from "../models/blacklisted.model.js";
import { extractToken } from "../utils/token.js";

export default async function authMiddleware(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const isBlacklisted = await blacklistTokenModel.exists({ token });

        if (isBlacklisted) {
            return res.status(401).json({ message: "Token blacklisted" });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const client = await clientModel.findById(decoded.id).lean();

        if (!client) {
            return res.status(401).json({ message: "Client not found" });
        }

        req.client = client;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}