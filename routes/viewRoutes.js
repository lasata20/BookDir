const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signup', viewController.getSignupForm);
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/books/:slug', authController.isLoggedIn, viewController.getBook);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/profile', authController.protect, viewController.getProfile);
router.get('/manage-directory', authController.protect, authController.restrictTo('admin'), viewController.getManageDirectory);
router.get('/manage-directory/add-book', authController.protect, authController.restrictTo('admin'), viewController.createBookForm);

router.get('/manage-users', authController.protect, authController.restrictTo('admin'), viewController.getManageUsers);


router.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;