const Sequelize = require('sequelize');
const db = require('../db');

const Score = db.define('score', {
  wpm: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  timeelapsed: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Score;
