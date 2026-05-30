import mongoose from "mongoose";

const restuarantMenuSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        cookTime: { type: Number, required: true, default: "15m" },
    },
    { timestamps: true }
);

const RestuarantMenu = mongoose.model("RestuarantMenu", restuarantMenuSchema);

export default RestuarantMenu;