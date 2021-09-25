const config = require("../database/databaseConfig");
const jwt = require("jsonwebtoken");

const isAuth = (request, response, next) => {
  const authHeader = request.get("Authorization");

  if (!authHeader) {
    return response.status(401).json({ error: "Not Authenticated" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, config.secretKey);
  } catch (err) {
    return response
      .status(500)
      .json({ message: err.message || "Failed to decode the token" });
  }

  if (!decodedToken) {
    return response.status(401).json({ message: "Unauthorized Access" });
  } else {
    next();
  }
};

module.exports = { isAuth };
