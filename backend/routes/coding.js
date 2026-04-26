const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const auth    = require("../middleware/auth");
const Submission = require("../models/Submission");

// Run/evaluate code using Claude AI
router.post("/run", auth, async (req, res) => {
  const { code, language, question } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  try {
    const prompt = `
You are a code evaluator. The user was asked:
"${question || 'Solve a programming problem'}"

They submitted this ${language} code:
\`\`\`${language}
${code}
\`\`\`

Simulate running this code and respond ONLY with valid JSON — no markdown:
{
  "output": "<simulated output or result>",
  "isCorrect": <true or false>,
  "feedback": "<brief one-line feedback>"
}`;

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

    res.json(result);

  } catch (err) {
    console.error("Run error:", err.message);
    res.status(500).json({ error: "Code evaluation failed" });
  }
});

// Submit code — save to DB with AI verdict
router.post("/submit", auth, async (req, res) => {
  const { code, language, question, company } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language required" });
  }

  try {
    const prompt = `
You are a strict coding interview evaluator for ${company || "a tech company"}.
Question: "${question || 'Solve a given problem'}"
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with valid JSON:
{
  "output": "<sample output>",
  "isCorrect": <true or false>,
  "score": <number 0-100>,
  "feedback": "<detailed feedback in 2-3 sentences>"
}`;

    const aiResponse = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        }
      }
    );

    const rawText = aiResponse.data.content[0].text;
    const clean   = rawText.replace(/```json|```/g, "").trim();
    const result  = JSON.parse(clean);

    // Save submission to MongoDB
    await Submission.create({
      userId:   req.userId,
      company,
      type:     "coding",
      language,
      code,
      question,
      result:   JSON.stringify(result)
    });

    res.json(result);

  } catch (err) {
    console.error("Submit error:", err.message);
    res.status(500).json({ error: "Submission failed" });
  }
});

module.exports = router;