const db = require("../database/createConnection");
const jwt = require("jsonwebtoken");

module.exports = { isAuth };

async function isAuth(request, response, next) {
  const authHeader = request.get("Authorization");

  if (!authHeader) {
    return response.status(401).json({ message: "Not Authenticated" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    return response
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }

  if (!decodedToken) {
    response.status(401).json({ message: "unauthorized" });
  } else {
    response.status(200).json({ message: "here is your resource" });
  }
}
