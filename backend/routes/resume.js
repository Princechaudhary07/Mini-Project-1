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

    const prompt = `
You are a professional resume reviewer. Analyze the following resume text and respond ONLY with a valid JSON object — no markdown, no explanation.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Respond with exactly this JSON structure:
{
  "score": <number between 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    console.log("Calling OpenRouter API...");

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Authorization": "Bearer " + process.env.ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Placement Prep AI"
        }
      }
    );

    const rawText = aiResponse.data.choices[0].message.content;
    const clean   = rawText.replace(/```json|```/g, "").trim();
    const result  = JSON.parse(clean);

    await Submission.create({
      userId:      req.userId,
      type:        "coding",
      resumeScore: result.score,
      strengths:   result.strengths,
      weaknesses:  result.weaknesses,
      suggestions: result.suggestions
    });

    res.json(result);

  } catch (err) {
    console.error("Resume error:", err.message);
    console.error("Full error:", err.response?.data);
    res.status(500).json({ error: "Analysis failed. Try again." });
  }
});

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