var express = require('express'),
    router = express.Router(),
    model = require('../mongoose/index'),
    formidable = require('formidable'),
    moment = require('moment'),
    srt2vtt = require('srt-to-vtt'),
    fs = require('fs');

function socket(io){
  io.on('connection', function(socket){
    router.post('/upload', function(req, res, next){
      var form = new formidable.IncomingForm();

      form.parse(req, function(err, field, file){
        // console.log(file);
      });
      form.on("fileBegin", function (name, file){
        if (file.name.match(/\.(gif|jpg|jpeg|tiff|png)$/i)) {
          var name = file.name.replace(/ /g,'-');
          file.path = "./public/file/poster/" + name.toLowerCase();
        }
        if (file.name.match(/\.(mp4|srt)$/i)) {
          var name = file.name.replace(/ /g,'-');
          file.path = "./public/file/film/" + name.toLowerCase();
        }
      });
      form.on('progress', function(bytesReceived, bytesExpected) {
        io.emit('upload',{bytesReceived:bytesReceived,bytesExpected:bytesExpected});
      });
      form.on("file", function (name, file){
          res.json({file});
          if (file.name.match(/\.(srt)$/i)) {
            var name = file.name.replace(/ /g,'-');
            var sub = name.replace('.srt','');
            fs.createReadStream('./public/file/film/'+name.toLowerCase())
              .pipe(srt2vtt())
              .pipe(fs.createWriteStream('./public/file/film/'+sub+'.vtt'));
            fs.unlink('./public/file/film/'+name.toLowerCase());
          }
      });

    }) // end router upload

  }) // end io connection
}

router.get('/', function(req, res, next){
  model.Blog.find({}, function(err, data){
    if(!err) res.render('admin/index',{data:data, title:'Admin Him Movie'});
  });
})

router.get('/posting', function(req, res, next){
  model.Category.find({}, function(err, data){
    if(!err)
    res.render('admin/posting',{category:data, title:'Admin Him Movie'});
  });
})

router.post('/posting', function(req, res, next){
  var video = req.body.video,
      poster = req.body.poster,
      subtitle = req.body.subtitle;
  video = video.replace(/ /g,'-');
  poster = poster.replace(/ /g,'-');
  subtitle = subtitle.replace(/ /g,'-');
  var tambah = new model.Blog({
      title:req.body.title,
      author:'ardyhim',
      file:[{
          poster:poster.toLowerCase(),
          video:video.toLowerCase(),
          subtitle:subtitle.toLowerCase()
        }],
      body: req.body.body,
      category:req.body.category.split(','),
      date: moment().format('DD/MM/YYYY'),
      hidden: 'false'
  });
  tambah.save(function(err,data){
    if(err){
      res.json({message:'succes'});
    }else{
    res.json(data);
    }
  });
})

router.delete('/posting/:id', function(req, res, next){
  model.Blog.remove({_id:req.params.id}, function(err, data){
    if(err) res.json({'message':'Failed to remove absensi'})
    else res.json({message:'succes to remove posting'});
  })
})

router.get('/category', function(req, res, next){
  model.Blog.find({}, function(err, data){
    if(!err) res.json({data});
  });
})

router.get('/test', function(req, res, next){
  model.Category.find({}, function(err, data){
    if(!err)
    res.render('admin/test',{category:data, title:'Admin Him Movie'});
  });
})


module.exports = {
  router: router,
  socket: socket
}
