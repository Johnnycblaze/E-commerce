const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login to continue",
        error: true,
        success: false
      });
    }

    const secretKey = process.env.TOKEN_SECRET_KEY || "fallback_super_secret_key_123";

    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) {
        return res.status(401).json({
          message: "Session expired or unauthorized",
          error: true,
          success: false
        });
      }

      req.userId = decoded?._id;
      next();
    });

  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed",
      error: true,
      success: false
    });
  }
}

module.exports = authToken;