//Require Mongoose
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var teacherSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Why no first name?']
  },
  insertion: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'Why no last name?']
  },
  profilePic: {
    type: String
  }},
  { collection: 'teachers'});

module.exports = mongoose.model('TeacherModel', teacherSchema );