import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../config";
import { motion } from "framer-motion";
import "../assets/styles/reset-password.css";
import MainNav from "./MainNav";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem("reset_email", email);
      const response = await axios.post(`${BASE_URL}/api/user/reset-password`, {
        email,
      });
      toast.success(response.data.message, { autoClose: 1500 });
      setTimeout(() => navigate("/verify-code"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending verification code.", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div>
      <MainNav />
      <motion.div
        className="reset-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="reset-box"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <h2 className="title">Reset Password</h2>
          <p>Enter your email to receive a password reset link.</p>
          <form onSubmit={handleReset}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
