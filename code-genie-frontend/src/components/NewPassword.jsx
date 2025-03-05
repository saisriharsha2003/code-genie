import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import MainNav from "./MainNav";
import BeatLoader from "react-spinners/BeatLoader";
import "../assets/styles/new-password.css";

const NewPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openCurrent, setOpenCurrent] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [formData, setFormData] = useState({
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
      const reset_email = localStorage.getItem("reset_email");
      const passwordResponse = await axios.put(
        `${BASE_URL}/api/user/new-password`,
        {
          reset_email,
          newPassword: formData.newPassword,
        }
      );

      toast.success(passwordResponse.data.message, { autoClose: 1500 });
      if (passwordResponse.status === 200) {
        toast.success("Redirecting to Login Page...", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error("Error updating password.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainNav />

      <div className="new-password-container">
        <motion.div
          className="new-password-box"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="new-password-title">Change Password</div>
          <form onSubmit={handleSubmit} className="new-password-form">
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
              className="new-password-btn"
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

export default NewPassword;
