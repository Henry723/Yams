var express = require('express');
var router = express.Router();
var foods = ["SPINACH", "CARROTS", "GREEN PEPPERS", "CELERY", "MUSHROOMS", "MIXED PEPPERS", "POTATOES"]


/***login user and render dashboard****/
router.post('/login', function(req, res, next){
  console.log(req.body.email);
  res.render('user');
});

/***register user and render dashboard****/
router.post('/register', function(req, res, next){
  console.log(req.body.email);
  res.render('user');
});

/****ajax response****/
router.get('/allFoods', function(req, res, next) {
  /**Pass through foodReference data***/
  res.send(foods);
});

/*******adding food to fridge****/
router.post('/newFoodItem', function(req, res, next){
})

/****delete item from fridge****/
router.delete("/:foodID", function(req, res, next){
})


module.exports = router;
