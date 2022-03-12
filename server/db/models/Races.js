const Sequelize = require('sequelize');
const db = require('../db');

const Race = db.define('race', {
  raceId: {
    type: Sequelize.STRING,
  },
});

module.exports = Race;
