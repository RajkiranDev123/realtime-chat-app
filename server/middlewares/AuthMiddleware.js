import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;
  // console.log("cookies ==> ",req.cookies)

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing jwt, you are not authorized.",
    });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token invalid.",
      });
    }

    req.userId = payload.userId;
    next();
  });
};
