const express = require("express");
const router = express.Router();
const { submitQuiz } = require("../controllers/submitController");

// Route to submit a quiz
router.post("/submitquiz", submitQuiz);

module.exports = router;
