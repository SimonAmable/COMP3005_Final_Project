const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg'); // Import the Client object from pg module

const PORT = process.env.PORT || 3000;
const ROOT_DIR = "html"; // Directory where HTML files are located

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, ROOT_DIR)));

app.post('/register', (req, res) => {
    // Handle form submission
    const formData = req.body;
    insertIntoMembers(formData.first_name, formData.last_name, formData.email, formData.password, formData.username, formData.phone_number);
    
    // Redirect user to a different page after submission
    res.redirect('/index.html');
}); 

function insertIntoMembers(firstname, lastname, email, password, username, phone) {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'final',
      password: 'urbA493s',
      port: 5432,
    });

    client.connect()
        .then(() => {
            return client.query(
                'INSERT INTO Members (first_name, last_name, email, password, username, phone_number) VALUES ($1, $2, $3, $4, $5, $6)',
                [firstname, lastname, email, password, username, phone]
            );
        })
        .then(() => {
            console.log('Data inserted into Members table');
        })
        .catch(err => {
            console.error('Error inserting data into Members table', err);
        })
        .finally(() => {
            client.end();
        });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
