var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Him Movie' });
});

router.get('/video', function(req, res, next){
  res.render('video', {title: 'Video'})
})

module.exports = router;
