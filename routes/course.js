'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { Course, User } = require('../models');

const router = express.Router();

router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
            },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json(courses);
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json(course);
}));

router.post('/courses', asyncHandler(async (req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).json({ 'message': 'course created' });
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

router.put('/courses/:id', asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.status(204).json({ 'message': 'course updated' });
        }
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).json({ 'message': 'course deleted' });
    } else {
        res.status(400).json({ 'message': 'bad request' });
    }
}));

module.exports = router;