const express = require("express");
const router = express.Router();
const encryptionController = require("../controllers/encryptionController");
const {
  addEncryptionData,
  getAllEncryptedData,
  deleteEncryptedData,
} = require("../controllers/encryptionController");
let text = ""; // Define text variable to store received text

// POST endpoint to receive text
router.post("/receive-text", (req, res) => {
  text = req.body.text;
  res.json({ success: true, message: "Text received" });
});

// POST endpoint to encrypt received text
router.post("/encrypt-text", async (req, res) => {
  try {
    const { text } = req.body; // Get the text from the request body
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required for encryption",
      });
    }

    // Encrypt the text using the encryptionController
    const { encryptedText, key, iv } = encryptionController.encrypt(text);

    res.json({ success: true, data: { encryptedText, key, iv } });
  } catch (error) {
    console.error("Encryption failed:", error);
    res.status(500).json({
      success: false,
      message: "Encryption failed",
      error: error.message,
    });
  }
});

router.post("/save-encryptedText", encryptionController.addEncryptionData);
router.post("/get-encryptedData", encryptionController.getAllEncryptedData);
router.post("/delete-encryptedData", encryptionController.deleteEncryptedData);

module.exports = router;
