const bcrypt = require("bcryptjs");

const hashed = (input) => {
  bcrypt.hash(input, 12, (err, hashedData) => {
    if (err) {
      return err;
    }
    return hashedData;
  });
};

const compare = (input, hash) => {
  bcrypt.compare(input, hash, (err, res) => {
    if (err) {
      console.error("error ",err);
      return "err";
    }
    return res;
  });
};

module.exports = {
  hashed,
  compare,
};
