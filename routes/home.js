var express = require('express');
var router = express.Router();
var db = require('../config/db');
var Request = require('tedious').Request;

/* GET Home page. */
router.get('/', function(req, res, next) {
	console.log("this is what i want");
	res.render('home');
});

module.exports = router;
