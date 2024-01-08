const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

//@desc    Register a new user
//@route   POST /api/users/register
//@access  Public

const createUser = asyncHandler(async (req, res) => {

    const { name, email, password} = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email, password and confirm password');
    }

    // if (password !== confirmPassword) {
    //     return res.status(400).json({
    //         status: 'fail',
    //         message: 'Passwords do not match'
    //     });
    // }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({
            status: 'fail',
            message: 'User already exists'
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const user = await User.create({ username: name, email, password: hashedPassword });

    if (user) {
        return res.status(201).json({
            _id: user._id,
            name: user.username,
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        });
    } else {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid user data'
        });
    }
});

//@desc    Login user
//@route   POST /api/users/login
//@access  Public

const loginUser = asyncHandler(async (req, res) => {
    
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }
    
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                _id: user._id,
                name: user.username,
                email: user.email,
                message: 'Login successful',
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
            });
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }
    });

//@desc    Get current user
//@route   GET /api/users/current
//@access  Private

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
        return res.status(400).json({
            status: 'fail',
            message: 'User not found'
        });
    }
    console.log(user);
    res.status(200).json({ user });

});



module.exports = { createUser, loginUser, getCurrentUser };
