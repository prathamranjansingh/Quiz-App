const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  quizCode: { type: String, unique: true, required: true },
  decryptedText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "3h" }, // Automatically delete after 3 hours
});

module.exports = mongoose.model("Quiz", quizSchema);
