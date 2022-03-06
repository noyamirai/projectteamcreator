//Require Mongoose
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Why no course Title?']
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    linkRef: {
        type: String,
        required: [true, 'Why no ref?']
    }
}, { collection: 'courses' }, { toJSON: { virtuals: true }});

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Why no class name?']
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { collection: 'classes' }, { toJSON: { virtuals: true }});

const userSchema = new mongoose.Schema({
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
    username: {
        type: String,
        required: [true, 'Why no username?']
    },
    type: {
        type: String,
        required: [true, 'Why no user type?']
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { collection: 'users' }, { toJSON: { virtuals: true }});

const Course = mongoose.model('Course', courseSchema, 'courses');
const User = mongoose.model('User', userSchema, 'users');
const Class = mongoose.model('Class', classSchema, 'classes');

module.exports = {
    Course,
    User,
    Class
};