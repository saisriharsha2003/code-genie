import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import user from "../assets/images/user.png";
import "../assets/styles/nav.css";
import edit from "../assets/images/edit.png";
import logout from "../assets/images/logout.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/images/logo.jpg";

const Nav = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    toast.success("Logging off...", {
      position: "top-right",
      autoClose: 1500,
    });
    localStorage.removeItem("name");
    navigate("/");
  };

  const toggleMenu = () => {
    try {
      const subm = document.getElementById("subMenu");
      if (subm) {
        subm.classList.toggle("open-menu");
      } else {
        console.error("subMenu element not found.");
      }
    } catch (error) {
      console.error("Error toggling menu:", error);
    }
  };

  return (
    <div className="hero">
      <nav>
        <Link to="/home">
          <img className="logo" src={logo} alt="App Logo" />
        </Link>

        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/chat-page">CodeGenie</Link>
          </li>
        </ul>

        <img src={user} className="user-pic" alt="User" onClick={toggleMenu} />

        <div className="sub-menu-wrap" id="subMenu">
          <div className="sub-menu">
            <div className="user-info">
              <img
                src={user}
                alt="User"
                style={{ width: "80px", height: "80px" }}
              />
              <h2 id="cu_name" style={{ color: "#00FFFF" }}>
                {userName}
              </h2>
            </div>
            <hr />
            <Link to="/edit-profile" className="sub-menu-link">
              <img
                src={edit}
                alt="Edit Profile"
                style={{ width: "50px", height: "50px" }}
              />
              <p>Edit Profile</p>
              <span className="ext">&gt;</span>
            </Link>
            <Link to="/change-password" className="sub-menu-link">
              <img
                src={edit}
                alt="Change Password"
                style={{ width: "50px", height: "50px" }}
              />
              <p>Change Password</p>
              <span className="ext">&gt;</span>
            </Link>
            <Link to="/" className="sub-menu-link" onClick={handleLogout}>
              <img
                src={logout}
                alt="Logout"
                style={{ width: "50px", height: "50px" }}
              />
              <p>Logout</p>
              <span className="ext">&gt;</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
