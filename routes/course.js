'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course, User } = require('../models');

const router = express.Router();

//Get courses
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

//Get specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
            },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json(course);
}));

//Create course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.redirect(201, `/courses/${course.id}` );
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

//Update course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const { currentUser } = res.locals;
        if (course) {
            if (course.userId === currentUser.id) {
                await course.update(req.body);
                res.status(204).json({ 'message': 'course updated' });
            } else {
                res.status(403).json({ 'message': 'Access denied, you must be the owner of the course to make changes.' });
            }
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));


//Delete course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const { currentUser } = res.locals;
        if (course) {
            if (course.userId === currentUser.id) {
                await course.destroy(req.body);
                res.status(204).json({ 'message': 'course deleted' });
            } else {
                res.status(403).json({ 'message': 'Access denied, you must be the owner of the course to make changes.' });
            }
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;