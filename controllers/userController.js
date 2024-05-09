const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');



exports.getAllUsers = catchAsync( async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data:{
            users
        }
    });
});

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        status: "success",
        data:{
            user
        }
    });
});

exports.createUser = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

exports.updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
});

exports.deleteUser = catchAsync(async (req, res) => {
    await User.findByIdAndDelete(req.params.id, req.body);

    res.status(200).json({
        status: 'success',
        data: null
    }) 
});
