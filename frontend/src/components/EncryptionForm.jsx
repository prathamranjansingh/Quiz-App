import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext.jsx";
import { useAuth0 } from "@auth0/auth0-react";

const EncryptionForm = () => {
  const [text, setText] = useState("");
  const [syntaxModal, setSyntaxModal] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const { isDarkMode } = useContext(StoreContext);

  const opensyntaxModal = () => {
    setSyntaxModal(true);
  };

  const closesyntaxModal = () => {
    setSyntaxModal(false);
  };

  const [formData, setFormData] = useState({
    title: "",
    encryptedText: "",
    key: "",
    iv: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      encryptedText: "",
      key: "",
      iv: "",
    }));
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      encryptedText: "",
      key: "",
      iv: "",
    }));
  };

  const handleEncryptAndReceiveText = async () => {
    try {
      // Step 1: Encrypt Text
      const encryptResponse = await axios.post(
        "http://localhost:3000/encrypt-text",
        {
          text,
        }
      );
      const { encryptedText, key, iv } = encryptResponse.data.data;

      // Update state with encrypted results
      setFormData({
        ...formData,
        encryptedText,
        key,
        iv,
      });
    } catch (error) {
      console.error("Encryption and/or saving text failed:", error);
    }
  };

  const handleSaveData = async () => {
    try {
      // Step 1: Encrypt Text if not already encrypted
      if (!formData.encryptedText) {
        await handleEncryptAndReceiveText();
      }

      // Step 2: Save encrypted data
      setIsModalOpen(true); // Open the confirmation modal
    } catch (error) {
      console.error("Saving data failed:", error);
    }
  };

  const confirmSave = async () => {
    try {
      const finalData = {
        title: formData.title,
        encryptedText: formData.encryptedText,
        key: formData.key,
        iv: formData.iv,
        auth0Id: user.sub,
      };

      const response = await axios.post(
        "http://localhost:3000/save-encryptedText",
        finalData
      );

      if (response.data.success) {
        toast.success("Data saved successfully", {
          className: isDarkMode ? "toastify-dark" : "",
        });
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message, {
          className: isDarkMode ? "toastify-dark" : "",
        });
      }
    } catch (error) {
      toast.error("Saving data failed", {
        className: isDarkMode ? "toastify-dark" : "",
      });
      console.error("Saving data failed:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="content-center dark:bg-[#000000]">
      <h1 className="mb-4 flex items-center justify-center text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Encryption Form
      </h1>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Title
      </label>
      <input
        type="text"
        name="title"
        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base  dark:bg-[#0d0b0b] dark:text-gray-400"
        placeholder="Enter title..."
        value={formData.title}
        onChange={handleChange}
      />
      <br />
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Questions
      </label>
      <textarea
        id="message"
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  dark:bg-[#0d0b0b] dark:text-gray-400"
        placeholder="Write the questions"
        name="text"
        value={text}
        onChange={handleTextChange}
      />
      <br />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleEncryptAndReceiveText}>
        Encrypt
      </button>
      {isAuthenticated && (
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleSaveData}>
          Save
        </button>
      )}

      <button
        onClick={opensyntaxModal}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        type="button">
        Syntax
      </button>

      {/* Main modal */}
      {syntaxModal && (
        <div
          id="static-modal"
          data-modal-backdrop="static"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Syntax For The Questions
                </h3>
                <button
                  onClick={closesyntaxModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="static-modal">
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {JSON.stringify([
                    {
                      question: "What is the capital of France?",
                      options: ["Paris", "London", "Rome", "Berlin"],
                    },
                    {
                      question: "Which planet is known as the Red Planet?",
                      options: ["Earth", "Mars", "Jupiter", "Venus"],
                    },
                  ])}
                </p>
              </div>
              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={closesyntaxModal}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  OK
                </button>
                <button
                  onClick={closesyntaxModal}
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-700 p-4 md:p-5 rounded-lg shadow">
            <button
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to save this data?
              </h3>
              <button
                onClick={confirmSave}
                className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-gren-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Yes, I'm sure
              </button>
              <button
                onClick={closeModal}
                className="ml-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <br />
      {formData.encryptedText && (
        <div>
          <h2 className="mb-4 mt-8 flex items-center justify-center text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white">
            Encryption Result:
          </h2>
          <div className="rounded-lg overflow-auto dark:bg-[#0d0b0b] p-8">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <strong>Encrypted Text: </strong> {formData.encryptedText}
            </p>
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <strong>Key: </strong> {formData.key}
            </p>
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <strong>IV: </strong> {formData.iv}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionForm;
