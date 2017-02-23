var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('door', { title: 'door page' });
});

module.exports = router;
