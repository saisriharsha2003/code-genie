import { StatusCodes } from "http-status-codes";
import User from "../models/User.js"; 
import jwt from "jsonwebtoken";
import { EMAIL_PASS, EMAIL_USER, JWT_SECRET } from "../config.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
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

  console.log("Username:", uname);

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

    res.status(StatusCodes.OK).json({
      token,
      name: user.name,
      uname: user.uname,
      message: "Login Successful!"
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error signing in", details: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification code not sent" });
  }
};

export const verifyCode = async (req, res) => {
  const {reset_email, code } = req.body;
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user || !user.resetPasswordCode) return res.status(400).json({ error: "Invalid request" });

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    res.json({ message: "Code verified, proceeding to update password" });
  } catch (error) {
    res.status(500).json({ error: "Error verifying code" });
  }

};

export const newPassword = async (req, res) => {
  const { reset_email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user) return res.status(400).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
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
