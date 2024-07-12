import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext.jsx";
import { useAuth0 } from "@auth0/auth0-react";

const EncryptedDataList = () => {
  const [encryptedData, setEncryptedData] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // To store the ID of the item to delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useContext(StoreContext);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchEncryptedData = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.post(
            "http://localhost:3000/get-encryptedData",
            { auth0Id: user.sub } // Send user.sub in the request body
          );
          setEncryptedData(response.data.data);
        } catch (error) {
          console.error("Error fetching encrypted data:", error);
        }
      }
    };

    fetchEncryptedData();
  }, [isAuthenticated, user]);

  const handleDelete = async (id) => {
    setDeleteId(id); // Store the ID of the item to delete
    setIsModalOpen(true); // Open the modal
  };

  const confirmDelete = async () => {
    try {
      // Send delete request
      await axios.post("http://localhost:3000/delete-encryptedData", {
        id: deleteId,
      });
      // Update state after deletion
      setEncryptedData((prevData) =>
        prevData.filter((data) => data._id !== deleteId)
      );
      setIsModalOpen(false); // Close the modal after successful deletion
      toast.success("Item deleted successfully", {
        className: isDarkMode ? "toastify-dark" : "",
      });
    } catch (error) {
      toast.error("Operation failed", {
        className: isDarkMode ? "toastify-dark" : "",
      });
      console.error("Error deleting encrypted data:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Encrypted Data List
      </h1>
      <div className="relative overflow-x-auto my-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#151516] dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Encrypted Text
              </th>
              <th scope="col" className="px-6 py-3">
                Key
              </th>
              <th scope="col" className="px-6 py-3">
                IV
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {encryptedData.map((data) => (
              <tr key={data._id} className="bg-white dark:bg-[#0d0b0b] ">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {data.title}
                </td>
                <td className="px-6 py-4 dark:text-white overflow-hidden">
                  {" "}
                  {data.encryptedText}
                </td>
                <td className="px-6 py-4 dark:text-white">{data.key}</td>
                <td className="px-6 py-4 dark:text-white">{data.iv}</td>
                <td className="px-6 py-4 dark:text-white">
                  <button
                    onClick={() => handleDelete(data._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                Are you sure you want to delete this item?
              </h3>
              <button
                onClick={confirmDelete}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
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
    </div>
  );
};

export default EncryptedDataList;
