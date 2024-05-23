const express = require('express');
const dirController = require('../controllers/dirController');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const router = express.Router();

// router.param('id', dirController.checkID);

router
    .route('/')
    .get(authController.protect, dirController.getAllBooks)
    
router
    .route('/')
    .post(authController.protect, authController.restrictTo('admin'), dirController.uploadPhoto, dirController.createBook);

router
    .route('/:id')
    .get(authController.protect, dirController.getBookById)
    .patch(dirController.updateBook)
    .delete(authController.protect, authController.restrictTo('admin'), dirController.deleteBook);

module.exports = router;