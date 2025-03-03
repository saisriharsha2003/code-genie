import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import Nav from "../components/Nav";
import BeatLoader from "react-spinners/BeatLoader";
import "../assets/styles/change-password.css";

const ChangePassword = () => {
  const uname = localStorage.getItem("username");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openCurrent, setOpenCurrent] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const passwordResponse = await axios.put(
        `${BASE_URL}/api/user/update-password/${uname}`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      toast.success(passwordResponse.data.message, { autoClose: 1500 });
      setTimeout(() => navigate("/home"), 3000);
    } catch (error) {
      toast.error("Error updating password.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />

      <div className="change-password-container">
        <motion.div
          className="change-password-box"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="change-password-title">Change Password</div>
          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type={openCurrent ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter your Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <div
                onClick={() => setOpenCurrent(!openCurrent)}
                className="eye-icon"
              >
                {openCurrent ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type={openNew ? "text" : "password"}
                name="newPassword"
                placeholder="Enter your New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <div onClick={() => setOpenNew(!openNew)} className="eye-icon">
                {openNew ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <motion.button
              type="submit"
              className="change-password-btn"
              whileHover={{ scale: 1.1 }}
            >
              {loading ? <BeatLoader size={10} /> : "Update Password"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
