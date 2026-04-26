const express  = require("express");
const router   = express.Router();
const axios    = require("axios");
const auth     = require("../middleware/auth");
const Submission = require("../models/Submission");

// ─── QUESTION BANK ──────────────────────────────────────────────────────────
const questions = [
  {
    id: 1,
    difficulty: "Easy",
    title: "Reverse a String",
    description: `Write a function reverseString(s) that takes a string s and returns it reversed.

Examples:
  reverseString("hello")   → "olleh"
  reverseString("world")   → "dlrow"
  reverseString("abcde")   → "edcba"

Constraints:
  • 1 ≤ s.length ≤ 10⁴
  • s consists of printable ASCII characters`
  },
  {
    id: 2,
    difficulty: "Easy",
    title: "Find Maximum in Array",
    description: `Write a function findMax(arr) that returns the largest number in an array of integers.

Examples:
  findMax([3, 1, 4, 1, 5, 9])  → 9
  findMax([-2, -5, -1, -8])    → -1
  findMax([42])                → 42

Constraints:
  • 1 ≤ arr.length ≤ 10⁵
  • -10⁹ ≤ arr[i] ≤ 10⁹
  • Do NOT use built-in max() / Math.max()`
  },
  {
    id: 3,
    difficulty: "Medium",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.

You may assume exactly one solution exists, and you may not use the same element twice.

Examples:
  twoSum([2, 7, 11, 15], 9)  → [0, 1]
  twoSum([3, 2, 4], 6)       → [1, 2]
  twoSum([3, 3], 6)          → [0, 1]

Constraints:
  • 2 ≤ nums.length ≤ 10⁴
  • -10⁹ ≤ nums[i] ≤ 10⁹
  • Expected time complexity: O(n)`
  },
  {
    id: 4,
    difficulty: "Medium",
    title: "Balanced Parentheses",
    description: `Write a function isBalanced(s) that returns true if the string s has balanced brackets, false otherwise.

Matching pairs: () [] {}

Examples:
  isBalanced("()")        → true
  isBalanced("()[]{}")    → true
  isBalanced("(]")        → false
  isBalanced("([)]")      → false
  isBalanced("{[]}")      → true

Constraints:
  • 0 ≤ s.length ≤ 10⁴
  • s consists of '(' ')' '{' '}' '[' ']' only`
  },
  {
    id: 5,
    difficulty: "Hard",
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring that contains no repeating characters.

Examples:
  lengthOfLongest("abcabcbb")  → 3   // "abc"
  lengthOfLongest("bbbbb")     → 1   // "b"
  lengthOfLongest("pwwkew")    → 3   // "wke"
  lengthOfLongest("")          → 0

Constraints:
  • 0 ≤ s.length ≤ 5 × 10⁴
  • s consists of English letters, digits, symbols, and spaces
  • Expected time complexity: O(n) using the sliding window technique`
  }
];

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

// ─── GET RANDOM QUESTION ────────────────────────────────────────────────────
router.get("/question", auth, (req, res) => {
  res.json(getRandomQuestion());
});

// ─── RUN / EVALUATE CODE ────────────────────────────────────────────────────
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

// ─── SUBMIT CODE ────────────────────────────────────────────────────────────
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