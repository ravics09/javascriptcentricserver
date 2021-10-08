require('dotenv/config');
const jwt = require("jsonwebtoken");

const isAuth = (request, response, next) => {
  const authHeader = request.get("Authorization");

  if (!authHeader) {
    response.status(401).send("Not Authenticated");
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return response
      .status(500)
      .json({ message: err.message || "Failed to decode the token" });
  }

  if (!decodedToken) {
    response.status(401).send("Unauthorized Access");
  }
  next();
};

module.exports = { isAuth };
