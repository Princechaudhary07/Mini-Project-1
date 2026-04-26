const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company:  { type: String },
  type:     { type: String, enum: ["aptitude", "coding"] },
  language: { type: String },
  code:     { type: String },
  question: { type: String },
  result:   { type: String },
  resumeScore:   { type: Number },
  strengths:     [String],
  weaknesses:    [String],
  suggestions:   [String],
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);