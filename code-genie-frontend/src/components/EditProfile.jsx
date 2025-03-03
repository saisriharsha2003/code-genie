import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaUserEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import Nav from "../components/Nav";
import BeatLoader from "react-spinners/BeatLoader";
import "../assets/styles/edit-profile.css";

const EditProfile = () => {
  const uname = localStorage.getItem("username");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    uname: "",
    newUname: "",
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/user/profile/${uname}`)
      .then((response) => {
        if (isMounted) {
          toast.success("Fetching Details...", { autoClose: 1500 });
          setFormData({
            name: response.data.name,
            email: response.data.email,
            mobile: response.data.mobile,
            uname: response.data.uname,
            newUname: "",
          });
        }
      })
      .catch(() => {
        toast.error("Failed to load profile details.", { autoClose: 1500 });
      })
      .finally(() => isMounted && setLoading(false));
    return () => {
      isMounted = false;
    };
  }, [uname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/user/update-profile/${uname}`,
        formData
      );
      toast.success(response.data.message, { autoClose: 1500 });
      localStorage.setItem("username", response.data.user.uname);
      localStorage.setItem("name", response.data.user.name);
      setTimeout(() => navigate("/home"), 3000);
    } catch (error) {
      toast.error("Error updating profile.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className="profile-container">
        <motion.div 
          className="profile-box" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="title">Edit Profile</div>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <FaPhone className="icon" />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="uname"
                placeholder="Current Username"
                value={formData.uname}
                readOnly
              />
            </div>
            <div className="input-group">
              <FaUserEdit className="icon" />
              <input
                type="text"
                name="newUname"
                placeholder="New Username"
                value={formData.newUname}
                onChange={handleChange}
              />
            </div>
            <motion.button 
              type="submit" 
              className="profile-btn"
              whileHover={{ scale: 1.1 }}
            >
              {loading ? <BeatLoader size={10} /> : "Update Profile"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
