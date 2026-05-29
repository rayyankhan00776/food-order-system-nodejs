import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientModel from "../models/client.model.js";
import config from "../configs/config.js";

export async function getToOrder(req, res) {
    try {
        const { name, email } = req.body || {};

        console.log("BODY:", req.body);

        // ---------------- VALIDATION ----------------
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        const nameRegex = /^[a-zA-Z0-9]+([ _-]?[a-zA-Z0-9]+)*$/;

        if (!nameRegex.test(name)) {
            return res.status(400).json({
                success: false,
                message:
                    "Name can only contain letters, numbers, spaces, underscores and hyphens",
            });
        }

        const emailRegex =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // ---------------- NORMALIZE ----------------
        const normalizedName = name.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        // ---------------- CHECK USER ----------------
        const clients = await clientModel.find();

        let existingClient = null;

        for (const client of clients) {
            const isNameMatch = await bcrypt.compare(
                normalizedName,
                client.name
            );

            const isEmailMatch = await bcrypt.compare(
                normalizedEmail,
                client.email
            );

            if (isNameMatch && isEmailMatch) {
                existingClient = client;
                break;
            }
        }

        // ---------------- LOGIN ----------------
        if (existingClient) {
            const token = jwt.sign(
                { id: existingClient._id },
                config.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("client_token", token, {
                httpOnly: true,
                secure: config.isProd, // ✅ CLEAN FIX
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                client: { id: existingClient._id },
            });
        }

        // ---------------- REGISTER ----------------
        const hashedName = await bcrypt.hash(normalizedName, 10);
        const hashedEmail = await bcrypt.hash(normalizedEmail, 10);

        const client = await clientModel.create({
            name: hashedName,
            email: hashedEmail,
        });

        const token = jwt.sign(
            { id: client._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("client_token", token, {
            httpOnly: true,
            secure: config.isProd, // ✅ CLEAN FIX
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "Client registered successfully",
            token,
            client: { id: client._id },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export default { getToOrder };