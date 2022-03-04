const schemas = require('../models/schemas');

const createUser = async (docObject) => {
    const user = new schemas.User(docObject);

    user.save((err) => {
        if (err) Promise.reject(err);
    });
}

const createMultipleUsers = async (docObjects) => {
    docObjects.forEach(doc => {
        schemas.User.insertMany(doc, (err) => {
            if (err) Promise.reject(err);
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
    getUserCourses
};