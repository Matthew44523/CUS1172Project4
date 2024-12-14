const express = require('express');
const router = express.Router();
const path = require('path');

// Serve registration form
router.get('/registrations/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/register.html'));
});

// Serve management page
router.get('/registrations/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/view.html'));
});

module.exports = router;
