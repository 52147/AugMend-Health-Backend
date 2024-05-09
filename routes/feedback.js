// feedback.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');

// Encrypt Feedback
const encryptFeedback = (feedback) => {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(feedback, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Insert Feedback
router.post('/feedback', async (req, res) => {
    const {
        patientName,
        therapySatisfaction,
        experienceFeedback,
        engagementFeedback,
        additionalComments
    } = req.body;
    try {
        const query = `INSERT INTO feedback (patientName, therapySatisfaction, experienceFeedback, engagementFeedback, additionalComments)
                       VALUES (?, ?, ?, ?, ?)`;
        const [results] = await pool.execute(query, [
            encryptFeedback(patientName),
            therapySatisfaction,
            encryptFeedback(experienceFeedback),
            engagementFeedback,
            encryptFeedback(additionalComments),
        ]);
        res.status(201).json({ message: 'Feedback stored successfully', id: results.insertId });
    } catch (error) {
        console.error('Error storing feedback:', error);
        res.status(500).json({ message: 'Error storing feedback', error });
    }
});

module.exports = router;
