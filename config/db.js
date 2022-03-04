require('dotenv').config()

const mongoose = require('mongoose');
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@teamcreator-db.9p0bn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Models
const CourseModel = require('../models/course-model');
const TeacherModel = require('../models/teacher-model');
const UserModel = require('../models/user-model');

const connectDb = async () => {
    try {
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

        console.log("DB connected");        
    } catch (error) {
        console.log(`error occured while trying to connect to db: ${error}`);
        throw error;
    }
}

const createCourse = async (title) => {
    var course = new CourseModel({ title: title });

     course.save(function (err) {
        if (err) return handleError(err);
        console.log('New Course: ' + course);
    });
}

const createManyCourses = async (titles) => {
    titles.forEach(title => {
        CourseModel.insertMany([{ title: title}], function(err) {
            if (err) return handleError(err);
            console.log(`New course added: ${title}`);
        });
    });    
}

const createUser = async ({firstname: firstName, insertion: insertion, lastname: lastName, type: type}) => {

    var user = new UserModel({
        name: {
            firstName: firstName, 
            insertion: insertion ? insertion : null, 
            lastName: lastName
        }, 
        type: type});

    user.save(function (err) {
        if (err) return handleError(err);
        console.log(`New user added: ${user.name.firstName}`);
        console.log(`${user.name.firstName} is a ${user.type}`);
    });
}

module.exports = {
    connectDb,
    createCourse,
    createManyCourses,
    createUser
};
