const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from middleware:", token); // เพิ่ม console.log()

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded); // เพิ่ม console.log()
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err); // เพิ่ม console.error()
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
