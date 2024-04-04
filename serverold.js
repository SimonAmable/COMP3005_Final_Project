const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = "html"; // Directory where your HTML files are located

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, ROOT_DIR, req.url === "/" ? "index.html" : req.url);
    
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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//POSTGRES SERVER

const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Fitness',
  password: 'Katherine',
  port: 5432,
  //http://localhost:3000/index.html
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch(err => console.error('Connection error', err))

function fetchEmployees() {
    
  client.query('SELECT * FROM Members')
    .then(res => {
      console.log('Members:', res.rows)
    })
    .catch(err => console.error('Error fetching employees', err))
    .finally(() => client.end())
}

fetchEmployees()
