const router = require('express').Router();
const {
  models: { User },
} = require('../db');
const authenticateAdminToken = require('./AuthToken');
module.exports = router;

router.get('/', authenticateAdminToken, async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'email'],
    });
    if (!users) next();
    res.json(users);
  } catch (err) {
    next(err);
  }
});
