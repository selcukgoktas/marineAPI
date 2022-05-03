const http = require('http');
require('dotenv').config();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});