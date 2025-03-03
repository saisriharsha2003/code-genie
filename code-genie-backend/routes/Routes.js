const express = require('express');
const { signup, signin, getUserProfile, updatePassword, updateUserProfile, chat_response } = require('../controllers/userController');
const router = express.Router();

router.route('/').get((req, res) => {
    res.send('Welcome to the NoteNexus!');
});

router.route('/register').post(signup);
router.route('/login').post(signin);
router.route('/chat').post(chat_response);
router.route('/profile/:uname').get(getUserProfile);
router.route('/update-password/:uname').put(updatePassword);
router.route('/update-profile/:uname').put(updateUserProfile);

module.exports = router;
