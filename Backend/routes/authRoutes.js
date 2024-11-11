const express = require('express');
const { signup, login, getUserDetails, logout, logoutAllDevices } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const   router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/userdetails', authMiddleware, getUserDetails);
router.get('/logout', authMiddleware, logout);
router.get('/logoutAll', authMiddleware, logoutAllDevices); 

module.exports = router;
