const crypto = require("crypto");
const EncryptionModel = require("../models/encryptionModel");

function encrypt(text) {
  const key = crypto.randomBytes(32); // Generate a random key
  const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
  const algorithm = "aes-256-cbc"; // Define the encryption algorithm

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return an object with the encrypted text, key, and IV
  return {
    encryptedText: encrypted,
    key: key.toString("hex"),
    iv: iv.toString("hex"),
  };
}
const addEncryptionData = async (req, res) => {
  const { title, encryptedText, key, iv, auth0Id } = req.body;

  try {
    // Check if an entry with the same title and auth0Id already exists
    const existingEntry = await EncryptionModel.findOne({ title, auth0Id });
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Title already exists. Please use a different title.",
      });
    }

    // If no entry with the same title and auth0Id exists, proceed to save the new entry
    const encryptionData = new EncryptionModel({
      title,
      encryptedText,
      key,
      iv,
      auth0Id,
    });

    await encryptionData.save();
    res.json({ success: true, message: "Encryption Data Added" });
  } catch (error) {
    console.error("Error saving encryption data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error saving encryption data." });
  }
};

const getAllEncryptedData = async (req, res) => {
  const { auth0Id } = req.body;

  try {
    const encryptedData = await EncryptionModel.find({ auth0Id });
    res.json({ success: true, data: encryptedData });
  } catch (error) {
    console.error("Error fetching encrypted data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching encrypted data." });
  }
};

const deleteEncryptedData = async (req, res) => {
  try {
    const { id } = req.body;
    await EncryptionModel.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Encrypted data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting encrypted data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting encrypted data." });
  }
};

module.exports = {
  deleteEncryptedData,
  getAllEncryptedData,
  encrypt,
  addEncryptionData,
};
