const Quiz = require("../models/generateQuiz");

exports.generateQuiz = async (req, res) => {
  const { decryptedText } = req.body;

  try {
    // Check if decryptedText is empty or not a string
    if (typeof decryptedText !== "string" || decryptedText.trim() === "") {
      return res
        .status(400)
        .json({ error: "Invalid decrypted text. Please provide valid input." });
    }

    // Check if a quiz with the same decryptedText already exists
    const existingQuiz = await Quiz.findOne({ decryptedText });

    if (existingQuiz) {
      // If a quiz with the same decryptedText exists, return its quiz code
      return res.status(200).json({
        message: "Quiz already generated for this text.",
        code: existingQuiz.quizCode,
      });
    } else {
      // Generate a unique quiz code
      const quizCode = generateUniqueQuizCode();

      // Save quiz details to MongoDB
      const quiz = new Quiz({
        quizCode,
        decryptedText,
      });
      await quiz.save();

      return res.status(200).json({ code: quizCode });
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Use Error.captureStackTrace to capture stack trace
    Error.captureStackTrace(error);
    return res
      .status(500)
      .json({ error: "Failed to generate quiz. Please try again later." });
  }
};

function generateUniqueQuizCode() {
  // Generate a random alphanumeric code
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

exports.takeQuiz = async (req, res) => {
  let quizCode = req.header("Quiz-Code");

  if (!quizCode) {
    quizCode = req.body.quizCode;
  }

  try {
    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ questions: quiz.decryptedText });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz details" });
  }
};
