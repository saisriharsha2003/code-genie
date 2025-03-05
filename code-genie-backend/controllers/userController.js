import { StatusCodes } from "http-status-codes";
import User from "../models/User.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";

export const signup = async (req, res) => {
  const { name, email, mobile, uname, password } = req.body;

  try {
    const existingUser = await User.findOne({ uname });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, uname, password: hashedPassword });

    await newUser.save();
    res.status(StatusCodes.CREATED).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  const { uname, password } = req.body;

  try {
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Username not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id, uname: user.uname }, 
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({ token, name: user.name, uname: user.uname, message: "Login Successful!" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error signing in", details: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { uname } = req.params;
    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    res.status(StatusCodes.OK).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      uname: user.uname,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching user profile", details: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { uname } = req.params;
  const { name, email, mobile, newUname } = req.body;

  try {
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (newUname) {
      const existingUser = await User.findOne({ uname: newUname });
      if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username already taken" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newUname) user.uname = newUname;

    await user.save();
    res.status(StatusCodes.OK).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating profile", details: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { uname } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating password", details: error.message });
  }
};

export const chat_response = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Message is required" });
    }

    console.log("User message received:", message);

    const flaskResponse = await axios.post("http://127.0.0.1:5000/api/chat", { message });
    const botReply = flaskResponse.data.botreply;
    

    res.status(StatusCodes.OK).json({ reply: botReply });
  } catch (error) {
    console.error("Error in chat_response:", error);

    let errorMessage = "Internal Server Error";
    if (error.response) {
      errorMessage = error.response.data.error || errorMessage;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage, details: error.message });
  }
};
