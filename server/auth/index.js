const router = require('express').Router();
const {
  models: { User },
} = require('../db');

router.post('/login', async (req, res, next) => {
  try {
    res.send({
      token: await User.authenticate({
        username: req.body.username,
        password: req.body.password,
      }),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = await User.create({
      username,
      password,
      email,
    });
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

router.put('/me', async (req, res, next) => {
  try {
    const users = await User.findByToken(req.headers.authorization);
    const { username, email } = req.body;
    res.send(await users.update({ username, email }));
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
