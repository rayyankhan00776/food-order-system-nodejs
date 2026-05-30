import jwt from "jsonwebtoken";
import clientModel from "../models/client.model.js";
import config from "../configs/config.js";
import blacklistTokenModel from "../models/blacklisted.model.js";
import { extractToken } from "../utils/token.js";
import axios from "axios";

export async function getToOrder(req, res) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        let client = await clientModel.findOne({ email: normalizedEmail });

        if (!client) {
            client = await clientModel.create({
                name: name.trim(),
                email: normalizedEmail,
            });
        }

        const token = jwt.sign(
            { id: client._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("client_token", token, {
            httpOnly: true,
            secure: config.isProd,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(client.isNew ? 201 : 200).json({
            success: true,
            token,
            client: { id: client._id },
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function logoutClient(req, res) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(400).json({ message: "No token found" });
        }

        await blacklistTokenModel.create({ token });

        res.clearCookie("client_token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error: error.message,
        });
    }
}
export async function getClientInfo(req, res) {
    try {
        const client = req.client;
        if (!client) { return res.status(404).json({ message: "Client not found" }); }
        return res.status(200).json({
            success: true,
            client: { id: client._id, totalOrders: client.totalOrders, }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching client info", error: error.message,
        });
    }
}

export async function getRestuarantMenu(req, res) {
    try {
        const MENU_SERVICE_URL = "http://localhost:3000/v1/api/restaurant";

        const response = await axios.get(`${MENU_SERVICE_URL}/menu`);

        return res.status(200).json({
            success: true,
            message: "Menu fetched successfully from restaurant service",
            data: response.data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching menu",
            error: error.message,
        });
    }
}

export default {
    getToOrder,
    logoutClient,
    getClientInfo,
    getRestuarantMenu
}
