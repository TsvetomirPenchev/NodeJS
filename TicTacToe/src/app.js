const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const SocketHandler = require('./modules/socket-handler');

const port = 8088;

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const socketHandler = new SocketHandler(http);
socketHandler.listen();
