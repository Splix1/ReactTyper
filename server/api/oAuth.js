const router = require('express').Router();
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
module.exports = router;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const GITHUB_URL = process.env.GITHUB_URL;

router.use(cors({ credentials: true, origin: true }));

router.get('/oauth/redirect', (req, res) => {
  axios
    .post(
      `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
    .then((response) => {
      res.redirect(
        `http://localhost:3000?access_token=${response.data.access_token}`
      );
    });
});
