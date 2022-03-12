const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../script/seed');
const Race = require('./db/models/Races');

const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();

const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:8080'],
  },
});

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('start-race', async (race) => {
    socket.broadcast.emit('start-race', race);
  });
});
