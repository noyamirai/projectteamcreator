//Require Mongoose
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: [true, 'Why no courseId?']
    },
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
    classId: {
        type: String,
        required: [true, 'Why no classId?']
    },
    title: {
        type: String,
        required: [true, 'Why no class name?']
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    linkRef: {
        type: String,
        required: [true, 'Why no ref?']
    }
}, { collection: 'classes' }, { toJSON: { virtuals: true }});

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'Why no userId?']
    },
    username: {
        type: String,
        required: [true, 'Why no username?']
    },
    email: {
        type: String,
        required: [true, 'Why no email?']
    },
    password: {
        type: String,
        required: [true, 'Why no password?']
    },
    name: {
        type: Object,
        required: [true, 'Why no name object?'],
        properties: {
            first: {
                type: String,
                required: [true, 'Why no first name?']
            },
            insertion: {
                type: String,
            },
            last: {
                type: String,
                required: [true, 'Why no last name?']
            }
        }
    },
    profile_pic: {
        type: String,
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    type: {
        type: String,
        required: [true, 'Why no user type?']
    },
    is_admin: {
        type: String,
        required: [true, 'Why no admin rights specified?']
    }
}, { collection: 'users' }, { toJSON: { virtuals: true }});

const teacherCourse = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Robert
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Front-end development
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }] // Classes that get front-end dev from robert?
}, { collection: 'classes' }, { toJSON: { virtuals: true }});

const Course = mongoose.model('Course', courseSchema, 'courses');
const User = mongoose.model('User', userSchema, 'users');
const Class = mongoose.model('Class', classSchema, 'classes');
const TeacherCourse = mongoose.model('TeacherCourse', teacherCourse, 'teacher_course');

module.exports = {
    Course,
    User,
    Class,
    TeacherCourse
};