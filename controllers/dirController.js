// const fs = require('fs');
const mongoose = require('mongoose');
const Book = require('../models/dirModel');
const catchAsync = require('../utils/catchAsync');


// const books = JSON.parse(
//     fs.readFileSync(`./dev-data/data/books-simple.json`)
// );

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

exports.getBookById = catchAsync(async (req, res) => {
        const book = await Book.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data:{
                book
            }
        });
});

exports.createBook =  catchAsync(async (req, res) => {
        const newBook = await Book.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                book: newBook
            }
        });
});

exports.updateBook = catchAsync(async (req, res) => {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        })
});

exports.deleteBook =  catchAsync(async (req, res) => {
    await Book.findByIdAndDelete(req.params.id, req.body);

    res.status(200).json({
        status: 'success',
        data: null
    }) 
});
