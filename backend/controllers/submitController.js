const QuizSubmission = require("../models/quizSubmissions");

const submitQuiz = async (req, res) => {
  const { quizCode, userName, answers } = req.body;

  try {
    // Validate input
    if (!quizCode || !userName || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    // Check if a submission with the same quizCode and userName exists
    const existingSubmission = await QuizSubmission.findOne({
      quizCode,
      userName,
    });

    if (existingSubmission) {
      return res
        .status(400)
        .json({ error: "Quiz already submitted by this user" });
    }

    // Validate answers format (assuming answers is an array of objects with question, answer, and selectedOption)
    for (const answer of answers) {
      if (
        typeof answer.question !== "string" ||
        typeof answer.answer !== "string" ||
        typeof answer.selectedOption !== "number"
      ) {
        return res.status(400).json({ error: "Invalid answer format" });
      }
    }

    // Create new submission
    const newSubmission = new QuizSubmission({
      quizCode,
      userName,
      answers,
    });

    await newSubmission.save();

    res.status(201).json({ message: "Quiz submitted successfully" });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

module.exports = {
  submitQuiz,
};
