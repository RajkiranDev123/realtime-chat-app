import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;
  // console.log("cookies ==> ", req.cookies);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing jwt, you are not authorized.",
    });
  }

  // const decoded = jwt.verify(token, secret) // Synchronous (blocking) version (no callback)
  // jwt don't return promise , Because its API (jwt.verify()) is callback-based, not promise-based.
  // So it returns undefined, not a Promise.

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    // Yes — this version is callback-based async, but not Promise-based async.
    // Asynchronous = “does not block the main thread”
    // Async can happen in multiple ways : callbacks , promises , timers , Event-based , streams etc
    // promise-based are preferred over callback-based : no callback hell , better error handling , easier chaining , supports async/await
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token invalid.",
      });
    }

    req.userId = decoded.userId;
    next();
  });
  // console.log(7) // will run before decoding
};
