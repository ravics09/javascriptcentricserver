const db = require("./../database/createConnection");
const bcrypt = require("bcryptjs");
const User = db.User;

module.exports = { createUser };
async function createUser(userDetails) {
  var e = false;

  if (
    await User.findOne({
      email: userDetails.email,
    })
  ) {
    e = true;
  }
  if (e) {
    throw (
      "Email address with " +
      userDetails.email +
      " is already taken. Please try with other email address."
    );
  }

  const user = new User(userDetails);
  if (userDetails.password) {
    user.hash = bcrypt.hashSync(userDetails.password, 10);
  }

  await user.save();

  return {
    response: {
      message: "You have signUp successfully. Please signIn here !!",
      userInfo: user,
    },
  };
}
