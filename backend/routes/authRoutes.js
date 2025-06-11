const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/check', authMiddleware, (req, res) => {
  res.status(200).json({
    loggedIn: true,
    user: req.user,
  });
});

module.exports = router;
