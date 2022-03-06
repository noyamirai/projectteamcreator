const { log } = require('async');
const schemas = require('../models/schemas');
const courseCRUD = require('../controller/course-crud');

const createUser = async (docObject) => {
    return new Promise((resolve, reject) => {
        console.log('creating user');
        const user = new schemas.User(docObject);

        user.save((err) => {
            if (err) reject(err);
            console.log('New user added to db');
            resolve(user);
        });

    });
}

// WORKS
const updateUserCourse = async (courseIds, userId) => {
    console.log('course ids: ' + courseIds);
    for (let doc of courseIds) {
        console.log("locating course: " + doc);
        await courseCRUD.findCourseByQuery("_id", doc).then((course) => {
            course.users.push(userId);
            course.save();
        })
    }
}


const createMultipleUsers = async (docObjects) => {
    docObjects.forEach(doc => {
        schemas.User.insertMany(doc, (err) => {
            if (err) Promise.reject(err);
            console.log('New users added to db');
        });
    });
}

// Return full user object
const findUserByQuery = async (key, equalTo) => {
    return new Promise((resolve, reject) => {
        schemas.User.find({ [`${key}`]: { "$eq": equalTo, "$exists": true }  }, (err, result) => {
            if (err) reject(err);

            if (!result.length) {
                console.log('user not found');
            } else {
                result.forEach((user) => {
                    // console.log('user found');
                    resolve(user);
                })
            }
        });
    })
}

const getUserCourses = async (id) => {
    return new Promise((resolve, reject) => {
        schemas.User.findOne({ id: id }).lean()

        .populate('courses').exec((err, user) => {
            if(err) reject(err);

            resolve(user.courses);
        });
    });
}

module.exports = {
    createUser,
    createMultipleUsers,
    findUserByQuery,
    getUserCourses,
    updateUserCourse
};