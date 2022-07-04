const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => { //Evertything with socket
    console.log('Client connected');
});


app.use('clientWebPage.html');

server.listen(9000, () => { //Port server listen on
    console.log("Listening on 9000");
});