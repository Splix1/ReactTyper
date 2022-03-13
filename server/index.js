const { db } = require('./db');
const express = require('express');
const PORT = process.env.PORT || 3000;
const INDEX = '/public/index.html';
const app = require('./app');
const seed = require('../script/seed');
const Race = require('./db/models/Races');
const socketIO = require('socket.io');
const path = require('path');

const server = app
  .use((req, res) => res.sendFile(path.join(__dirname, '..', INDEX)))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('start-race', async (race) => {
    let match = await Race.findByPk(race.raceId);
    await match.update({ inProgress: true });
    await match.save();
    socket.broadcast.emit('start-race', race);
  });
});
