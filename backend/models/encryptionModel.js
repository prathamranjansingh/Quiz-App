const mongoose = require("mongoose");

const encryptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  encryptedText: { type: String, required: true },
  key: { type: String, required: true },
  iv: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  auth0Id: { type: String, required: true }, // Adding auth0Id to associate with User
});

const EncryptionModel = mongoose.model("EncryptionData", encryptionSchema);

module.exports = EncryptionModel;
