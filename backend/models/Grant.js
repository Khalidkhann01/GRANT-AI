const mongoose = require("mongoose");

const grantSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    goals: String,
    donorType: String,
    organization: String,
    location: String,
    duration: String,
    email: String,
    emails: { type: [String], default: [] }, 
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "completed", "failed"]
    },

    pdfData: { type: Buffer },

    // AI-generated fields
    proposal: { type: String, default: "" },
    htmlProposal: { type: String, default: "" },
    score: Number,
    grade: String,
    fundability: String,
    risk_level: String,
    donor_matches: { type: Array, default: [] },
    score_breakdown: { type: Object, default: {} },
    recommendations: { type: Array, default: [] },
    top_selling_points: { type: Array, default: [] },
    executive_summary: String,
    donor_pitch: String,
    elevator_pitch: String,
    funding_recommendation: String,
    sdgs: { type: Array, default: [] },
    beneficiaries: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grant", grantSchema);