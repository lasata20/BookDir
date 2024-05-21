// const fs = require('fs');
const mongoose = require('mongoose');
const multer =require('multer');
const Book = require('../models/dirModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


// const books = JSON.parse(
//     fs.readFileSync(`./dev-data/data/books-simple.json`)
// );


const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/books');
    },
    filename: (req, file, cb) => {
        cb(null, `book-${Date.now()}.jpg`);
    }
});

const multerFilter = (req, files, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true)
//     } else {
//         cb(new AppError('Not an image! Please upload image', 400), false);
//     }
    const ext = path.extname(files.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
        return cb(new AppError('Only images and pdf files allowed'));
    }
        cb(null, true);


}

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPhoto =upload.single('image');

exports.getAllBooks = catchAsync(async (req, res) => {
    const books = await Book.find();

    res.status(200).json({
        status: "success",
         results: books.length,
        data:{
                books
        }
    });
});

exports.getBookById = catchAsync(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

        // if(!book) {
        //     return next(new AppError('No Book found', 404))
        // }

    res.status(200).json({
        status: "success",
        data:{
            book
        }
    });
});

exports.createBook =  catchAsync(async (req, res) => {
    const image = req.file.filename;
    const newBookData = {
        ...req.body,
        image
    };

    const newBook = await Book.create(newBookData);

    res.status(201).json({
        status: 'success',
        data: {
            book: newBook
        }
    });
});

exports.updateBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!book) {
        return next(new AppError('No Book found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    })
});

exports.deleteBook =  catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id, req.body);

    if(!book) {
        return next(new AppError('No Book found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: null
    }) 
});
