const crypto = require("crypto");
const { log } = require("console");
function encrypt(text, key, iv) {
  const algorithm = "aes-256-cbc";

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex"); // 0123456789ABCDEF

  encrypted += cipher.final("hex");

  return encrypted;
}
function decrypt(encrypted, key, iv) {
  const algorithm = "aes-256-cbc";
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
console.log("key: ", key);
console.log("iv: ", iv);
const encryptedText = encrypt("PROBLEM_STATEMENT", key, iv);
console.log("encryptedText: ", encryptedText);
const decryptedText = decrypt(encryptedText, key, iv);

console.log(decryptedText);
