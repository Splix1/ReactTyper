const Sequelize = require('sequelize');
const db = require('../db');

const Race = db.define('race', {
  raceId: {
    type: Sequelize.STRING,
  },
  roomID: {
    type: Sequelize.INTEGER,
  },
  completed: {
    type: Sequelize.BOOLEAN,
  },
  inProgress: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Race;
