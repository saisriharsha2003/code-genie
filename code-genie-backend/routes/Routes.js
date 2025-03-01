const express = require('express');
const { signup, signin, add_note, view_notes, view_note_by_id, edit_note, delete_note, getUserProfile, updatePassword, updateUserProfile } = require('../controllers/userController');
const router = express.Router();

router.route('/').get((req, res) => {
    res.send('Welcome to the NoteNexus!');
});

router.route('/register').post(signup);
router.route('/login').post(signin);
router.route('/profile/:uname').get(getUserProfile);
router.route('/update-password/:uname').put(updatePassword);
router.route('/update-profile/:uname').put(updateUserProfile);

module.exports = router;
