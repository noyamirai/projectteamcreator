//Require Mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = Schema({
    title: {
        type: String,
        required: [true, 'Why no Title?']
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { collection: 'courses' });

const userSchema = new Schema({
    name: {
        type: Object,
        required: [true, 'Why no name object?'],
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
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
}, { collection: 'users' });

const Course = mongoose.model('Course', courseSchema, 'courses');
const User = mongoose.model('User', userSchema, 'users');

module.exports = {
    Course,
    User
};