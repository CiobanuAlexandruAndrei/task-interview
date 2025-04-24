const express = require('express');
const router = express.Router();


router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


router.use('/documents', require('./documents'));


module.exports = router; 