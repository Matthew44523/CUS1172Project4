const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/registrations.json');

// Helper to read/write database
function readDatabase() {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
}
function writeDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate unique ticket number
function generateTicketNumber() {
    return `TICKET-${Date.now()}`;
}

// POST /api/register
router.post('/register', (req, res) => {
    const { name, email, date, eventName } = req.body;
    if (!name || !email || !date || !eventName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const newRegistration = {
        ticketNumber: generateTicketNumber(),
        name,
        email,
        date,
        eventName
    };
    const registrations = readDatabase();
    registrations.push(newRegistration);
    writeDatabase(registrations);
    res.json(newRegistration);
});

// GET /api/registrations
router.get('/registrations', (req, res) => {
    const registrations = readDatabase();
    res.json(registrations);
});

// GET /api/registrations/byname/:name
router.get('/registrations/byname/:name', (req, res) => {
    const name = req.params.name;
    const registrations = readDatabase().filter(r => r.name === name);
    res.json(registrations);
});

// GET /api/registrations/event/:eventName
router.get('/registrations/event/:eventName', (req, res) => {
    const eventName = req.params.eventName;
    const registrations = readDatabase().filter(r => r.eventName === eventName);
    res.json(registrations);
});

// GET /api/registrations/cancel/:anyfieldregardingticket
router.get('/registrations/cancel/:identifier', (req, res) => {
    const identifier = req.params.identifier;
    const registrations = readDatabase();

    // Check if identifier matches a ticket number
    let updatedRegistrations = registrations.filter(r => r.ticketNumber !== identifier);

    if (registrations.length !== updatedRegistrations.length) {
        writeDatabase(updatedRegistrations);
        return res.json({ message: `Ticket with number ${identifier} canceled successfully.` });
    }

    // Check if identifier matches a name or event name
    updatedRegistrations = registrations.filter(r => r.name !== identifier && r.eventName !== identifier);

    if (registrations.length !== updatedRegistrations.length) {
        writeDatabase(updatedRegistrations);
        return res.json({ message: `Registrations associated with '${identifier}' canceled successfully.` });
    }

    // If nothing was deleted
    res.status(404).json({ error: `No ticket, name, or event found for '${identifier}'.` });
});


module.exports = router;
