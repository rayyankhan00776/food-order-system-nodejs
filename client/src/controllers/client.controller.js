import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientModel from "../models/client.model.js";
import config from "../configs/config.js";

export async function getToOrder(req, res) {
    try {
        // Extract name and email from request body (safe fallback with || {})
        const { name, email } = req.body || {};

        // Debug: log incoming request body
        console.log("BODY:", req.body);

        // ---------------- VALIDATION: required fields ----------------
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        // ---------------- VALIDATION: name format ----------------
        const nameRegex = /^[a-zA-Z0-9]+([ _-]?[a-zA-Z0-9]+)*$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({
                success: false,
                message:
                    "Name can only contain letters, numbers, spaces, underscores and hyphens",
            });
        }

        // ---------------- VALIDATION: email format ----------------
        const emailRegex =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // ---------------- NORMALIZATION ----------------
        // convert to lowercase and trim spaces for consistency
        const normalizedName = name.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        // ---------------- FETCH ALL CLIENTS ----------------
        const clients = await clientModel.find();

        let existingClient = null;

        // ---------------- LOGIN CHECK (bcrypt compare) ----------------
        for (const client of clients) {
            const isNameMatch = await bcrypt.compare(
                normalizedName,
                client.name
            );

            const isEmailMatch = await bcrypt.compare(
                normalizedEmail,
                client.email
            );

            // if both match, user exists (login case)
            if (isNameMatch && isEmailMatch) {
                existingClient = client;
                break;
            }
        }

        // ---------------- LOGIN FLOW ----------------
        if (existingClient) {
            // create JWT token
            const token = jwt.sign({ id: existingClient._id, }, config.JWT_SECRET, { expiresIn: "7d", }
            );

            // store token in httpOnly cookie
            res.cookie("client_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true, message: "Login successful", token, client: { id: existingClient._id, },
            });
        }

        // ---------------- REGISTER FLOW ----------------

        // hash name and email before storing in DB
        const hashedName = await bcrypt.hash(normalizedName, 10);
        const hashedEmail = await bcrypt.hash(normalizedEmail, 10);

        // create new client
        const client = await clientModel.create({ name: hashedName, email: hashedEmail, });
        // generate JWT token for new user
        const token = jwt.sign({ id: client._id, }, config.JWT_SECRET, { expiresIn: "7d", }
        );
        // store token in cookie
        res.cookie("client_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "Client registered successfully",
            token,
            client: {
                id: client._id,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export default {
    getToOrder,
};