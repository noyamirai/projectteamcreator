// Model
const schemas = require('../models/schemas');

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
    getCourseIdByTitle
};