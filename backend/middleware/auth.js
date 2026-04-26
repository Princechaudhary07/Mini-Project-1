const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Auth Header received:", authHeader);

  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token valid, userId:", decoded.id);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};