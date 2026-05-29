import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        totalOrders: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const clientModel = mongoose.model("Client", clientSchema);

export default clientModel;