import React from "react";
import { Routes, Route } from "react-router-dom";
import EncryptionForm from "./components/EncryptionForm";
import DecryptionForm from "./components/DecryptionForm";
import EncryptedDataList from "./pages/EncryptedDataList/EncryptedDataList";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TakeQuiz from "./pages/TakeQuiz/TakeQuiz";
function App() {
  return (
    <div className="App mx-24 mt-8">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/List" element={<EncryptedDataList />} />
        <Route path="/Encrypt" element={<EncryptionForm />} />
        <Route path="/Takequiz" element={<TakeQuiz />} />
        <Route path="/Decrypt" element={<DecryptionForm />} />
      </Routes>
    </div>
  );
}

export default App;
