const express = require("express");
const router = express.Router();
const generatekeyController = require("../controllers/generatekeyController");

router.post("/generatekey", (req, res) => {
  try {
    const { key, iv } = generatekeyController.generateKeys();
    res.json({ success: true, data: { key, iv } });
  } catch (error) {
    console.error("Key generation failed:", error);
    res.status(500).json({ success: false, error: "Key generation failed" });
  }
});

module.exports = router;
