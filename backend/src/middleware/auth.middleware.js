const jwt = require("jsonwebtoken");

// Check user login or not
const isUserLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not logged in",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    console.log('login middleware')

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User not logged in",
    });
  }
};

module.exports = {
  isUserLogin,
};
