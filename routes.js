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
    await User.create(req.body);
    res.status(201).json({ 'message': 'user created' });
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await user.destroy();
        res.status(201).json({ 'message': 'user deleted' });
    } else {
        res.status(400).json({ 'message': 'bad request' });
    }
}));

module.exports = router;