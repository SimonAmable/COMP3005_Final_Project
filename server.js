const http = require("http");
const fs = require("fs");
const path = require("path");
const { parse } = require("querystring");

const { Client } = require('pg'); // Import the Client object from pg module

const PORT = process.env.PORT || 3000;
const ROOT_DIR = "html"; // Directory where your HTML files are located

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, ROOT_DIR, req.url === "/" ? "index.html" : req.url);
    
    if (req.method === "POST") {
        // Handle form submission
        handleFormSubmission(req, res);
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        } else {
            const contentType = getContentType(filePath);
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
});

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        default:
            return "application/octet-stream";
    }
}

function handleFormSubmission(req, res) {
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const formData = parse(body);
        const email = formData.email;
        const password = formData.password;
        
        // Insert email and password into the database
        insertIntoMembers(email, password);
        
        // Redirect user to a different page after submission
        res.writeHead(302, { "Location": "/success.html" });
        res.end();
    });
}

function insertIntoMembers(email, password) {
    // Connect to PostgreSQL database and insert email and password into Members table
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'Fitness',
        password: 'Katherine',
        port: 5432,
    });

    const firstname = "Kat";
    const lastname = "Mac";
    const username = "sniffer";
    const phone = "6132970975";

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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
