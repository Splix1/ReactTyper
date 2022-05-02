const { db } = require('./db');
const express = require('express');
const PORT = process.env.PORT || 3000;
const INDEX = '/public/index.html';
const app = require('./app');
const seed = require('../script/seed');
const Race = require('./db/models/Races');
const Score = require('./db/models/Score');
const socketIO = require('socket.io');
const path = require('path');
const Socket = require('./db/models/Sockets');

const server = app
  .use((req, res) => res.sendFile(path.join(__dirname, '..', INDEX)))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  Socket.create({ socketID: socket.id });

  let currentRaceID;
  let currentUserID;
  let currentName;

  socket.on('start-race', async (race) => {
    let match = await Race.findByPk(race.raceId);
    await match.update({ inProgress: true });
    await match.save();
    socket.broadcast.emit('start-race', race);
  });

  socket.on('left-game', async (user) => {
    currentRaceID = null;
    socket.broadcast.emit('player-left', { name: user.name });
  });

  socket.on('joined-race', async (user) => {
    currentRaceID = user.raceID;
    currentUserID = user.userID;
    currentName = user.name;
    socket.broadcast.emit('new-player', { name: user.name });
  });

  socket.on('disconnect', async () => {
    socket.broadcast.emit('player-left', { name: currentName });
  });
});
