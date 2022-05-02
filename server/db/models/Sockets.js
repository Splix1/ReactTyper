const Sequelize = require('sequelize');
const db = require('../db');

const Socket = db.define('socket', {
  socketID: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Socket;
