import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },
        githubLink: {
            type: String,
            required: true,
            trim: true,
        },
        hostedLink: {
            type: String,
            trim: true,
        },
        finalResumeLink: {
            type: String,
            trim: true,
        },
        remark: {
            type: String,
            trim: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
