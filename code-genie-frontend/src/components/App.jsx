import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import { ToastContainer } from "react-toastify";
import ChatPage from "./ChatPage";
import ResetPassword from "./ResetPassword";
import VerifyCode from "./VerifyCode";
import NewPassword from "./NewPassword";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat-page" element={<ChatPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
