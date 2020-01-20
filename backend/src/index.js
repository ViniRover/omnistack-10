const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const http = require('http');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app)

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:chareka21@cluster0-imyjy.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(express.json());
app.use(routes);

server.listen(3333);