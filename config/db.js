require('dotenv').config()

const { log } = require('async');
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

const createUser = async ({firstname: firstName, insertion: insertion, lastname: lastName, type: type, given_courses: courseArray}) => {
    var user = new UserModel({
        name: {
            firstName: firstName, 
            insertion: insertion ? insertion : null, 
            lastName: lastName
        }, 
        type: type,
        given_courses: courseArray});

    user.save(function (err) {
        if (err) {
            console.log(err);
        }
        console.log(`New user added: ${user.name.firstName}`);
        console.log(`${user.name.firstName} is a ${user.type}`);
        console.log(`${user.name.firstName} has the following courses: ${user.given_courses}`);
    });
}

const getUserByLastName = async (lastName) => {
    return new Promise((resolve, reject) => {
        UserModel.find({"name.lastName" : {"$eq" : lastName, "$exists" : true}}, function (err, result) {
            if (err) reject(err);

            result.forEach((user) => {
                resolve(user);
            })
        });
    });
}

const getCourseIdByTitle = (courseTitles) => {
    return new Promise((resolve, reject) => {
        // Search query for one course
        if(typeof courseTitles != "Array") {
            const courseTitle = courseTitles;
            CourseModel.find({"title" : {"$eq" : courseTitle, "$exists" : true}}, function (err, result) {
                if (err) reject(err);

                result.forEach((course) => {
                    resolve(course.id);
                })
            });

        } else {
            // Search query for multiple courses
            let courseIds = [];
            let counter = 0;

            courseTitles.forEach((title) => {
                CourseModel.find({"title" : {"$eq" : title, "$exists" : true}}, function(err, result) {
                    counter++;
                    if (err) reject(err);

                    result.forEach((course) => {
                        courseIds.push(course.id);
                    })

                    if (counter == courseTitles.length) {
                        resolve(courseIds);
                    }
                });
            });
        }
    });
}

module.exports = {
    connectDb,
    createCourse,
    createManyCourses,
    createUser,
    getUserByLastName,
    getCourseIdByTitle
};
