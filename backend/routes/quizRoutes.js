const express = require("express");
const router = express.Router();
const quizController = require("../controllers/generateQuiz");

// POST request to generate a quiz code
router.post("/generate-quiz", quizController.generateQuiz);
router.get("/takequiz", quizController.takeQuiz);

module.exports = router;
