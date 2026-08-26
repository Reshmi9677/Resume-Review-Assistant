const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },

    atsScore: {
        type: Number,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    strengths: {
        type: [String],
        default: []
    },

    improvements: {
        type: [String],
        default: []
    },

    missingSkills: {
        type: [String],
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ResumeAnalysis = mongoose.model(
    "ResumeAnalysis",
    resumeAnalysisSchema
);

module.exports = ResumeAnalysis;