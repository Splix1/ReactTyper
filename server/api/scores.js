const router = require('express').Router();
const {
  models: { Race, Score, User },
} = require('../db');
module.exports = router;

router.post('/', async (req, res, next) => {
  try {
    let { WPM, userId, timeElapsed, wordsTyped, mode, raceId } = req.body;
    let newScore = await Score.create({
      wpm: WPM,
      userId: userId,
      timeelapsed: timeElapsed,
      wordsTyped,
      mode,
      raceId,
    });

    res.send();
  } catch (err) {
    next(err);
  }
});

router.post('/newrace', async (req, res, next) => {
  try {
    let { roomID, completed, inProgress } = req.body;
    let newRace = await Race.create({ roomID, completed, inProgress });
    res.json(newRace);
  } catch (err) {
    next(err);
  }
});

router.get('/sprintraceresults', async (req, res, next) => {
  try {
    let { raceid } = req.headers;
    let results = await Score.findAll({
      where: {
        raceId: raceid,
      },
      include: [{ model: User, attributes: ['username'] }],
    });
    res.send(results);
  } catch (err) {
    next(err);
  }
});

router.get('/roommatch', async (req, res, next) => {
  try {
    let { roomid } = req.headers;
    let room = await Race.findOne({
      where: {
        roomID: roomid,
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(room);
  } catch (err) {
    next(err);
  }
});

router.get('/listofplayers', async (req, res, next) => {
  try {
    let { raceid } = req.headers;
    let players = await Score.findAll({
      where: {
        raceId: raceid,
      },
      include: [{ model: User, attributes: ['username'] }],
    });
    res.json(players);
  } catch (err) {
    next(err);
  }
});
