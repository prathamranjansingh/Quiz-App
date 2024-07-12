import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext.jsx";

const DecryptionForm = () => {
  const { isDarkMode } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    encryptedText: "",
    key: "",
    iv: "",
    decryptedText: "",
    error: null,
  });

  const [questions, setQuestions] = useState([]);
  const [quizCode, setQuizCode] = useState(""); // State to store the generated quiz code
  const [copySuccess, setCopySuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/decrypt", {
        encryptedText: formData.encryptedText,
        key: formData.key,
        iv: formData.iv,
      });
      const { decryptedText } = response.data;
      console.log("Decrypted JSON:", decryptedText);
      const parsedQuestions = JSON.parse(decryptedText).map((question) => ({
        ...question,
        options: question.options.map((option) => ({
          text: option,
          checked: false,
        })),
      }));
      setQuestions(parsedQuestions);
      setFormData({ ...formData, decryptedText, error: null });
    } catch (error) {
      console.error("Decryption failed:", error);
      setFormData({
        ...formData,
        decryptedText: "",
        error: "Decryption failed. Please check your inputs.",
      });
      setQuestions([]);
    }
  };

  const handleRadioChange = (questionIndex, optionIndex) => {
    const updatedQuestions = questions.map((question, idx) => {
      if (idx !== questionIndex) return question;
      return {
        ...question,
        options: question.options.map((option, oIdx) => ({
          ...option,
          checked: oIdx === optionIndex,
        })),
      };
    });
    setQuestions(updatedQuestions);
  };

  const handleGenerateQuizCode = async () => {
    try {
      const response = await axios.post("http://localhost:3000/generate-quiz", {
        decryptedText: formData.decryptedText,
      });
      console.log(response.data);
      const { code, message } = response.data;
      setQuizCode(code);
      toast.success(message);
    } catch (error) {
      console.error("Failed to generate quiz code:", error);
      toast.error("Failed to generate quiz code. Please try again.");
    }
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quizCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopySuccess(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4 flex items-center justify-center text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Decryption Form
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Encrypted Text:
          </label>
          <input
            type="text"
            name="encryptedText"
            placeholder="Enter Encrypted Text..."
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base dark:bg-[#0d0b0b] dark:text-gray-400"
            value={formData.encryptedText}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Key:
          </label>
          <input
            type="text"
            name="key"
            placeholder="Enter Key..."
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base dark:bg-[#0d0b0b] dark:text-gray-400"
            value={formData.key}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
            IV:
          </label>
          <input
            type="text"
            name="iv"
            placeholder="Enter IV..."
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base dark:bg-[#0d0b0b] dark:text-gray-400"
            value={formData.iv}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className="text-white mt-8 bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          type="submit">
          Decrypt
        </button>

        <button
          className="text-white mt-8 bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleGenerateQuizCode}>
          Generate Quiz Code
        </button>
        {quizCode && (
          <div className="w-full max-w-[16rem]">
            <div className="relative">
              <label htmlFor="npm-install-copy-button" className="sr-only">
                Label
              </label>
              <input
                id="npm-install-copy-button"
                type="text"
                className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={quizCode}
                disabled
                readOnly
              />
              <button
                onClick={copyToClipboard}
                data-tooltip-target="tooltip-copy-npm-install-copy-button"
                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                disabled={copySuccess} // Disable button when copied
              >
                <span
                  id="default-icon"
                  className={
                    copySuccess ? "hidden" : "inline-flex items-center"
                  }>
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20">
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
                <span
                  id="success-icon"
                  className={
                    copySuccess ? "inline-flex items-center" : "hidden"
                  }>
                  <svg
                    className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
              </button>
              <div
                id="tooltip-copy-npm-install-copy-button"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                <span id="default-tooltip-message">Copy to clipboard</span>
                <span
                  id="success-tooltip-message"
                  className={copySuccess ? "" : "hidden"}>
                  Copied!
                </span>
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          </div>
        )}
      </form>
      {questions.length > 0 && (
        <div>
          <h3>Decrypted Questions:</h3>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <h4>{question.question}</h4>
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={option.checked}
                        onChange={() =>
                          handleRadioChange(questionIndex, optionIndex)
                        }
                      />
                      {option.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {formData.error && (
        <div style={{ color: "red" }}>
          <p>{formData.error}</p>
        </div>
      )}
    </div>
  );
};

export default DecryptionForm;
