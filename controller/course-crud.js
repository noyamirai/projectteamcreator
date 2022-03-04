// Model
const schemas = require('../models/schemas');

// courseCRUD.createMultipleCourses({ title: "Project Tech" });
const createCourse = async (docObject) => {
    const course = new CourseModel(docObject);

    course.save((err) => {
        if (err) Promise.reject(err);
    }); 
}

// courseCRUD.createMultipleCourses([{ title: "Project Tech" }, { title: "Front-end Development" }]);
const createMultipleCourses = async (docObjects) => {
    docObjects.forEach(doc => {
        schemas.Course.insertMany(doc, (err) => {
            if (err) Promise.reject(err);
        });
    });
}

// Return full course object
const findCourseByQuery = async (key, equalTo) => {
    return new Promise((resolve, reject) => {
        schemas.Course.find({ [`${key}`]: { "$eq": equalTo, "$exists": true } }, (err, result) => {
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

// Returns one or more course ids
// courseCRUD.getCourseIdByTitle(['Project Tech', 'Front-end Development'])
const getCourseIdByTitle = (courseTitles) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(courseTitles)) {
            console.log('not array?');
            schemas.Course.find({ "title": { "$eq": courseTitles, "$exists": true } }, (err, result) => {
                if (err) reject(err);

                if (!result.length) {
                    console.log('course not found');
                } else {
                    result.forEach((course) => {
                        resolve(course.id);
                    })
                }
            });
        } else {
            // Search query for multiple courses
            let courseIds = [];
            let counter = 0;

            courseTitles.forEach((title) => {
                schemas.Course.find({ "title": { "$eq": title, "$exists": true } }, function (err, result) {
                    counter++;
                    if (err) reject(err);

                    if (!result.length) {
                        console.log('course not found');
                    } else {
                        result.forEach((course) => {
                            courseIds.push(course.id);
                        })

                        if (counter == courseTitles.length) {
                            resolve(courseIds);
                        }
                    }
                });
            });
        }
        
    });
}

module.exports = {
    createCourse,
    createMultipleCourses,
    findCourseByQuery,
    getCourseIdByTitle
};