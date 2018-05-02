var express = require('express');
var router = express.Router();
var foods = ["SPINACH", "CARROTS", "GREEN PEPPERS", "CELERY", "MUSHROOMS", "MIXED PEPPERS", "POTATOES"]
/* GET users dashboard. */
router.get('/', function(req, res, next) {
  /**Pass through users foodData(fridge) && foodReference data***/
  res.render('user');
});

/****ajax response****/
router.get('/allFoods', function(req, res, next) {
  /**Pass through foodReference data***/
  res.send(foods);
});

/*******adding food to fridge****/
router.post('/', function(req, res, next){
})

/****delete item from fridge****/
router.delete("/", function(req, res, next){
})


module.exports = router;
