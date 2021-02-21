'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { Course } = require('../models');

const router = express.Router();

router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json(course);
}));

router.post('/courses', asyncHandler(async (req, res) => {
    await Course.create(req.body);
    res.status(201).json({ 'message': 'course created' });
}));

router.put('/courses/:id', asyncHandler(async (req, res) => {

}));

router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(201).json({ 'message': 'course deleted' });
    } else {
        res.status(400).json({ 'message': 'bad request' });
    }
}));

module.exports = router;