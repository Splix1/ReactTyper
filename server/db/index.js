const db = require('./db');
const User = require('./models/User');
const Score = require('./models/Score');

User.hasMany(Score);
Score.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
  },
};
