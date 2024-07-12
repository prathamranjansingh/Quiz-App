const crypto = require("crypto");

function decrypt(encrypted, key, iv) {
  const keyHex = Buffer.from(key, "hex");
  const ivHex = Buffer.from(iv, "hex");
  const algorithm = "aes-256-cbc";
  const decipher = crypto.createDecipheriv(algorithm, keyHex, ivHex);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { decrypt };
