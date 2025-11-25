const crypto = require("crypto");

const genPassword = (password) => {
  return crypto.createHash("sha512").update(password).digest("hex");
};

module.exports = {
  genPassword,
};
