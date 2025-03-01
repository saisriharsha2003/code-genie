const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { name, email, mobile, uname, password } = req.body;

  try {

    const existingUser = await User.findOne({ uname });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const signin = async (req, res) => {
  const { uname, password } = req.body;

  try {
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ Error: 'Username Not Found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ Error: 'Wrong Password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(StatusCodes.OK).json({ token, name: user.name, username: user.uname, message: "Login Successfull!!"  }); 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: 'Error signing in', error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { uname } = req.params; 

    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      uname: user.uname,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { uname } = req.params; 
  const { name, email, mobile, newUname } = req.body; 

   
  try {
    const user = await User.findOne({ uname });

    const oname = user.name;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newUname) {
      const existingUser = await User.findOne({ uname: newUname });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newUname) user.uname = newUname;

    const updatedUser = await user.save();

    const updatedName = name || user.name; 
    const updatedUsername = newUname || uname; 

    await Note.updateMany(
      { owner_username: uname }, 
      {
        $set: {
          owner: updatedName,
          owner_username: updatedUsername,
        },
      }
    );

    await Note.updateMany(
      {
        $or: [
          { lastEditedBy: oname }, 
          { lastEditedBy: null }, 
        ],
      },
      {
        $set: {
          lastEditedBy: updatedName, 
        },
      }
    );
   
    return res.status(200).json({
      message: 'Profile and related notes updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};


const updatePassword = async (req, res) => {
  try {
    const { uname } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};


module.exports = { signup, signin, add_note, view_notes, view_note_by_id, edit_note, delete_note, getUserProfile, updatePassword, updateUserProfile};
