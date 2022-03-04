//Require Mongoose
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: Object,
        required: [true, 'Why no first name?'],
        properties: {
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
            }
        }
    },
    type: {
        type: String,
        required: [true, 'Why no user type?']
    },
    given_courses: {
        type: []
    }},
    { collection: 'users'});

module.exports = mongoose.model('UserModel', userSchema );