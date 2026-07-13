const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const axios    = require("axios");
const auth     = require("../middleware/auth");
const Submission = require("../models/Submission");

const upload = multer({ storage: multer.memoryStorage() });

// Extract text from PDF buffer
async function extractTextFromPDF(buffer) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }


router.get("/history", auth, async (req, res) => {
  try {
    const history = await Submission.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

module.exports = router;
