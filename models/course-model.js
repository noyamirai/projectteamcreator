//Require Mongoose
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var courseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Why no Title?']
  }},
  { collection: 'courses'});

module.exports = mongoose.model('CourseModel', courseSchema );