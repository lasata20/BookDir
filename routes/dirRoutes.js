const express = require('express');
const dirController = require('../controllers/dirController');

const router = express.Router();

// router.param('id', dirController.checkID);

router
    .route('/')
    .get(dirController.getAllBooks)
    .post(dirController.createBook);

router
    .route('/:id')
    .get(dirController.getBookById)
    .patch(dirController.updateBook)
    .delete(dirController.deleteBook);

module.exports = router;