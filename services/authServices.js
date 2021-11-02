require("dotenv/config");
const jwt = require("jsonwebtoken");

const isAuth = (request, response, next) => {
  const authHeader = request.get("Authorization");

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, res) => {
      if (err) {
        response.status(401).send("JWT Token Expired");
      } else {
        next();
      }
    });
  } else response.status(401).send("Authentication Required! Please SignIn!!");
};

module.exports = { isAuth };
