const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/mail');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        confirmPassword: req.body.ConfirmPassword,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    //Check if email and password exist
    if(!email || !password) {
       return next(new AppError('Please provide email and password!', 400));
    }
    //Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //If everything ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });

});


exports.protect = catchAsync ( async (req, res, next) => {
    // Getting token and check if it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(
            new AppError('Please Log In!!!', 401)
        );
    }
    // Verifying token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(
            new AppError('User belonging to token no longer exist.', 401)
        );
    }

    // Check if user changed pw after token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('Password Changed! Login Again!', 401)
        )
    }  

    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You have no permission!', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('User not found!!!', 404));
    }

    //Generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //Send it to user's mail
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resestPassword/${resetToken}`;

    const message = `Forgot Password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\n If you didn't, please ignore this mail.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token.',
            message
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!!'
        });
    }catch(err) {
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('Error sending Email!', 500));
    }    
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: { $gt: Date.now() }
    });

    if(!user) {
        return next(new AppError('Token is invalid or expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });

});