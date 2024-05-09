// seedAdmin.js
const bcrypt = require('bcryptjs');
const pool = require('./db');
require('dotenv').config();

const seedAdminUser = async () => {
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await pool.execute(query, [username, hashedPassword]);
        console.log('Admin user seeded successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

seedAdminUser();
