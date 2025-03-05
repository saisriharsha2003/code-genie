import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../config";
import { motion } from "framer-motion";
import "../assets/styles/verify-code.css";
import MainNav from "./MainNav";

const VerifyCode = () => {
  const [code, setCOde] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("Please enter verification code", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    try {
      const reset_email = localStorage.getItem("reset_email");
      if (!reset_email) {
        toast.error("Email not found", { autoClose: 1500 });
        return;
      }
      const response = await axios.post(`${BASE_URL}/api/user/verify-code`, {
        code, reset_email
      });
      toast.success(response.data.message, { autoClose: 1500 });
      setTimeout(() => navigate("/new-password"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Wrong Verification Code", {
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
        className="verify-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="verify-box"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <h2 className="title">Verify Account</h2>
          <form onSubmit={handleReset}>
            <div className="input-group">
              <FaKey className="icon" />
              <input
                type="password"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCOde(e.target.value)}
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Verify Code"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VerifyCode;
