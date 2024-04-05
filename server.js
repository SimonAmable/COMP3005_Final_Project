const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg'); // Import the Client object from pg module

const PORT = process.env.PORT || 3000;
const ROOT_DIR = "html"; // Directory where HTML files are located

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, ROOT_DIR)));

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'final',
    password: 'urbA493s',
    port: 5432,
  });
  
client.connect()
    .then(() => console.log('Database client connected'))
    .catch(err => console.error('Connection error', err.stack));



    
//REGISTERING A USER 
app.post('/register', (req, res) => {
    const formData = req.body
    insertIntoMembers(formData.first_name, formData.last_name, formData.email, formData.password, formData.username, formData.phone_number);
    //Redirect user to a different page after submission
    res.redirect('/index.html');
}); 


//LOGGING USER IN
app.post('/login', (req, res) => {
    const formData = req.body
    checkCredentials(formData.email, formData.password)
        .then(result => {
            if(result) 
                res.redirect('/account.html')
            else 
                res.status(401).send('Invalid email or password')
        })
        .catch(err => {    res.status(500).send('Internal server error')   });
});





process.on('SIGINT', () => {
    client.end()
      .then(() => console.log('Database client disconnected'))
      .catch(err => console.error('Error disconnecting database client', err))
      .finally(() => process.exit());
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



function insertIntoMembers(firstname, lastname, email, password, username, phone) {
    return client.query(
        'INSERT INTO Members(first_name, last_name, email, password, username, phone_number) VALUES($1, $2, $3, $4, $5, $6)',
        [firstname, lastname, email, password, username, phone]
    )
    .then(() => {    console.log('Data inserted into Members table');               })
    .catch(err => {  console.error('Error inserting data into Members table', err); });
}

function checkCredentials(email, password) {
    console.log('Server-side email:', email)
    console.log('Server-side password:', password)

    return client.query(
        'SELECT * FROM Members WHERE email = $1 AND password = $2', [email, password]
    )
    .then(result => {
        console.log('Query result:', result.rows)
        return result.rows.length > 0;
    })
    .catch(err => {
        console.error('Error checking credentials', err);
        throw err;
    });
}