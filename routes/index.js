var express = require('express');
var router = express.Router();

/* GET Home page. */
router.get('/', function(req, res, next) {
  /**Pass users table through***/
  res.render('index');
});

module.exports = router;
