const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require ('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type:  String,
        required: [true, 'Name required'],
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid mail']
    },   
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },    
    confirmPassword: {
        type: String, 
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            }
        }
    }
});

userSchema.pre('save', async function(next) {
    //only if password is modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;