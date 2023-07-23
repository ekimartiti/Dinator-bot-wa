const express = require('express');
const server = express();

server.all('/', (req, res) => {
    res.send('<h2>Server is ready!</h2>');
});

module.exports = () => {
    server.listen(80, () => {
        console.log('Server Dijalankan');
    });
    return true;
}