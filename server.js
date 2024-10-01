// Import required dependencies
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const app = express(); // Initialize an express app

// Middleware to parse JSON requests
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // MySQL host
    user: process.env.DB_USERNAME,   // MySQL username
    password: process.env.DB_PASSWORD, // MySQL password
    database: process.env.DB_NAME    // MySQL database name
});

// Establishing the connection to the MySQL database
db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

/*
 * Question 1: Retrieve all patients
 * This endpoint retrieves all the patients from the database.
 * It selects 'patient_id', 'first_name', 'last_name', and 'date_of_birth' fields from the 'patients' table.
 */
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients');
        } else {
            res.json(results); // Respond with JSON data containing the patients' information
        }
    });
});

/*
 * Question 2: Retrieve all providers
 * This endpoint retrieves all healthcare providers from the database.
 * It selects 'first_name', 'last_name', and 'provider_specialty' fields from the 'providers' table.
 */
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.json(results); // Respond with JSON data containing the providers' information
        }
    });
});

/*
 * Question 3: Filter patients by first name
 * This endpoint filters patients by their first name, which is provided as a query parameter.
 * It selects patients from the 'patients' table where the 'first_name' matches the query.
 */
app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name; // Get the 'first_name' from the query string

    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    db.query(sql, [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients by first name');
        } else {
            res.json(results); // Respond with JSON data containing the filtered patients
        }
    });
});

/*
 * Question 4: Retrieve all providers by specialty
 * This endpoint retrieves healthcare providers based on their specialty, provided as a query parameter.
 * It selects providers from the 'providers' table where 'provider_specialty' matches the query.
 */
app.get('/providers/specialty', (req, res) => {
    const specialty = req.query.specialty; // Get the 'specialty' from the query string

    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers by specialty');
        } else {
            res.json(results); // Respond with JSON data containing the filtered providers
        }
    });
});

// Basic endpoint to confirm that the server is running successfully
app.get('/', (req, res) => {
    res.send('Server is running successfully');
});

// Start the server and listen on the specified port (from the .env file or default to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
