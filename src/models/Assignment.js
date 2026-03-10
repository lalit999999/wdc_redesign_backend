import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
