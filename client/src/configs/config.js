import dotenv from "dotenv";

dotenv.config();

// ---------------- ENV VALIDATION ----------------
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined");
    process.exit(1);
}

// ---------------- CONFIG OBJECT ----------------
export const config = {
    PORT: process.env.PORT || 3001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,

    // centralized NODE_ENV
    NODE_ENV: process.env.NODE_ENV || "development",

    // helper flags (cleaner usage in code)
    isProd: process.env.NODE_ENV === "production",
    isDev: process.env.NODE_ENV !== "production",
};

export default config;