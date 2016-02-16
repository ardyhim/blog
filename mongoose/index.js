var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://localhost:/movie');
var db = mongoose.connection;
db.on('open', function(err){
  console.log('database connected');
})
db.on('error', function(err){
  console.log(err);
})

autoIncrement.initialize(db);
var Schema = mongoose.Schema;
//create schema for blog post
var blogSchema = new mongoose.Schema({
  title:  String,
  author: String,
  body:   String,
  category: Array,
  file: [Schema({poster: String, video:String, subtitle: String})],
  comments: [Schema({ body: String, date: Date })],
  date: String,
  hidden: Boolean,
  meta: [Schema({
    votes: Number,
    favs:  Number
  })]
});

var categorySchema = new mongoose.Schema({
  category: String
});


//compile schema to model
categorySchema.plugin(autoIncrement.plugin, 'categorySchema');
blogSchema.plugin(autoIncrement.plugin, 'blogSchema');
var Category = db.model('category', categorySchema);
var Blog = db.model('blog', blogSchema);


module.exports = {
  Blog: Blog,
  Category: Category
}
