var express = require('express');
var router = express.Router();
var db = require('../config/db');
var Request = require('tedious').Request;

/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

module.exports = router;
