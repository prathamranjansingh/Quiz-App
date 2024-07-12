const crypto = require("crypto");

function generateKeys() {
  const key = crypto.randomBytes(32).toString("hex");
  const iv = crypto.randomBytes(16).toString("hex");
  return { key, iv };
}

module.exports = {
  generateKeys,
};
