const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  selectedOption: {
    type: Number, // Storing the index
    required: true,
  },
  answer: {
    type: String, // Storing the text of the selected option
    required: true,
  },
});

const quizSubmissionSchema = new mongoose.Schema({
  quizCode: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  answers: [answerSchema],
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

// Create model from schema
const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);

module.exports = QuizSubmission;
