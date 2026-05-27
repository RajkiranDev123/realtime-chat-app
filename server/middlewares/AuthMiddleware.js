import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;
  console.log("cookies ==> ", req.cookies);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing jwt, you are not authorized.",
    });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    // jwt.verify() becomes asynchronous when you use a callback because Node.js follows the async callback pattern for many operations
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token invalid.",
      });
    }

    req.userId = decoded.userId;
    next();
  });
};
