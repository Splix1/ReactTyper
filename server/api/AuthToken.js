const {
  models: { User },
} = require('../db');
const jwt = require('jsonwebtoken');

async function authenticateToken(req, res, next) {
  try {
    const token = req.headers['authorization'];

    if (token === null) return res.sendStatus(401);

    const { id } = jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(id);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function authenticateAdminToken(req, res, next) {
  try {
    const token = req.headers['authorization'];

    if (token === null) return res.sendStatus(401);

    const { id } = jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(id);
    if (user.role === 'admin') {
      req.user = user;
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = authenticateAdminToken;
module.exports = authenticateToken;
