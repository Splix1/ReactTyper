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

  wordsTyped: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  mode: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  raceId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Score;
