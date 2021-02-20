'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');

const router = express.Router();


router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));

router.post('/users', asyncHandler(async (req, res) => {
    await console.log(req.body);
    res.status(201).json({ 'message': 'user created' });
}));

module.exports = router;