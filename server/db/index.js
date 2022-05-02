const db = require('./db');
const User = require('./models/User');
const Score = require('./models/Score');
const Race = require('./models/Races');
const Socket = require('./models/Sockets');

User.hasMany(Score);
Score.belongsTo(User);

// User.belongsToMany(Score, { through: Race })
// Score.belongsToMany(User, { through : Race })

module.exports = {
  db,
  models: {
    User,
    Score,
    Race,
    Socket,
  },
};
