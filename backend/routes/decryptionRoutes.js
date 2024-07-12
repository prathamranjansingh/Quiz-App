const express = require("express");
const router = express.Router();
const decryptionController = require("../controllers/decryptionController.js");

router.post("/decrypt", (req, res) => {
  const { encryptedText, key, iv } = req.body;

  try {
    const decryptedText = decryptionController.decrypt(encryptedText, key, iv);
    res.json({ success: true, decryptedText });
  } catch (error) {
    console.error("Decryption error:", error.message);
    res.status(500).json({ success: false, error: "Decryption failed" });
  }
});

module.exports = router;
