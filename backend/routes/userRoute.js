const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');
const { 
  userSignUpController, 
  userSignInController, 
  userRouterDetails, 
  userLogout, 
  allUsersController 
} = require('../controller/userController');

// Support both /api/signup and /api/auth/signup
router.post('/signup', userSignUpController);
router.post('/auth/signup', userSignUpController);

// Support signin endpoints
router.post('/signin', userSignInController);
router.post('/auth/login', userSignInController);
router.post('/login', userSignInController);

router.get('/user-details', authToken, userRouterDetails);

// Logout endpoints
router.get('/logout', userLogout);
router.post('/logout', userLogout);
router.post('/auth/logout', userLogout);

// All Users
router.get('/all-users', authToken, allUsersController);
router.get('/auth/all-users', authToken, allUsersController);

module.exports = router;