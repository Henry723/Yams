var express = require('express');
var router = express.Router();

/* GET scanner page. */
router.get('/scanner', function(req, res, next) {
  res.render('scanner');
});

module.exports = router;
