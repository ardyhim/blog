var express = require('express');
var router = express.Router();

 var model = require('../mongoose/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.Blog.find({}, function(err, data){
    if(!err) res.render('movie/index',{data:data, title:'Him Movie'});
  });
});

router.get('/post/:id', function(req, res, next){
  model.Blog.find({_id:req.params.id}, function(err, data){
    if(!err) res.render('movie/post',{data:data, title:'Him Movie - '+data[0].title});
  });
})

router.get('/test', function(req, res, next){
  model.Blog.find({}, function(err, data){
    if(!err) res.render('movie/test',{data:data, title:'Test index'});
  });
})

module.exports = router;
