const { db } = require('./db');
const PORT = process.env.PORT || 3000;
const INDEX = '/public/index.html';
const app = require('./app');
const seed = require('../script/seed');
const Race = require('./db/models/Races');
const socketIO = require('socket.io');

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
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
