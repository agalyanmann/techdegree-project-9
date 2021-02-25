'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { User } = require('../models');

const router = express.Router();

//Get users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    res.json(users);
}));

//Create user
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({ 'message': 'user created' });
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));


//Delete user
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