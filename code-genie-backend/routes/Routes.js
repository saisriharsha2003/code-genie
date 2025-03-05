import express from "express";
import { signup, signin, getUserProfile, updatePassword, updateUserProfile, chat_response, resetPassword, verifyCode, newPassword } from "../controllers/userController.js"; // Use import instead of require

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Welcome to the NoteNexus!");
});

router.route("/register").post(signup);
router.route("/login").post(signin);
router.route("/chat").post(chat_response);
router.route("/profile/:uname").get(getUserProfile);
router.route("/update-password/:uname").put(updatePassword);
router.route("/update-profile/:uname").put(updateUserProfile);
router.route("/reset-password").post(resetPassword);
router.route("/verify-code").post(verifyCode);
router.route("/new-password").put(newPassword);

export default router;
