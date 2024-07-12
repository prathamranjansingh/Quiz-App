import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TakeQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth0();

  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://localhost:3000/takequiz", {
        headers: {
          "Quiz-Code": quizCode,
        },
        data: {
          quizCode,
        },
      });
      const { questions } = response.data;
      // Initialize each question with a selectedOption set to null
      const formattedQuestions = JSON.parse(questions).map((question) => ({
        ...question,
        selectedOption: null,
      }));
      setQuestions(formattedQuestions);
      setError("");
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      setError("Quiz not found or failed to fetch.");
      setQuestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions have been answered
    const unansweredQuestions = questions.filter(
      (question) => question.selectedOption === null
    );
    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    // Logic for handling quiz submission
    const answers = questions.map((question) => ({
      question: question.question,
      answer: question.options[question.selectedOption], // Fetch the text of the selected option
      selectedOption: question.selectedOption,
    }));

    try {
      await axios.post("http://localhost:3000/submitquiz", {
        quizCode, // Ensure quizCode is included in the data
        userName: user.name,
        answers,
      });
      setQuestions([]);
      toast.success("Quiz submitted successfully");

      // Clear quizCode after successful submission
      setQuizCode("");
    } catch (error) {
      toast.error(
        "Failed to submit quiz.. check if you have already submitted"
      );
      console.error("Failed to submit quiz:", error);
    }
  };

  const handleRadioChange = (questionIndex, optionIndex) => {
    const updatedQuestions = questions.map((question, idx) => {
      if (idx !== questionIndex) return question;
      return {
        ...question,
        selectedOption: optionIndex,
      };
    });
    setQuestions(updatedQuestions);
  };

  const handleQuizCodeChange = (e) => {
    setQuizCode(e.target.value);
    // Reset questions when quiz code changes
    setQuestions([]);
    setError("");
  };

  return (
    <div>
      <div className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Fetch Quiz
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            value={quizCode}
            onChange={handleQuizCodeChange}
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Provide the code"
            required
          />
          <button
            onClick={fetchQuiz}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Fetch Quiz
          </button>
        </div>
      </div>

      {error && <p>{error}</p>}

      {questions.length > 0 && (
        <div>
          <h2 className="text-center text-4xl font-bold dark:text-white">
            Quiz Questions ({quizCode})
          </h2>
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold dark:text-white my-6">
                  Question {index + 1}: {question.question}
                </h3>
                <ul>
                  {question.options.map((option, idx) => (
                    <li key={idx}>
                      <div className="flex items-center mb-4">
                        <input
                          className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={question.selectedOption === idx}
                          onChange={() => handleRadioChange(index, idx)}
                        />
                        <label className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {option}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              type="submit">
              Submit Answers
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
