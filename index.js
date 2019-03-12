const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();
server.use(express.json());

server.listen(8000, () => console.log('API running...'));