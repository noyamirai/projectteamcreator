const schemas = require('../models/schemas');

// courseCRUD.createMultipleCourses({ title: "Project Tech" });
const createDoc = async (schema, object) => {
    return new Promise((resolve, reject) => {
        const doc = new schema(object);

        doc.save((err) => {
            if (err) reject(err);
            console.log('New doc added to db');
            resolve(doc);
        });
    });
}

// CRUD.createMultipleDocs(schemas.Course, [{title: "Front-end Development"}, {title: "Project Tech"}])
const createMultipleDocs = async (schema, objects) => {
    return new Promise((resolve, reject) => {
        schema.insertMany(objects, (err, result) => {
            if(err) reject(err);
            console.log('Multiple docs added to db');
            resolve(result);
        });
    });
}

const findDocByQuery = async (schema, property, equalTo) => {
    return new Promise((resolve, reject) => {
        schema.find({ [`${property}`]: { "$eq": equalTo, "$exists": true } }, (err, result) => {
            if (err) reject(err);

            if (!result.length) {
                console.log('doc not found');
            } else {
                result.forEach((doc) => {
                    console.log('doc found');
                    resolve(doc);
                })
            }
        });
    })
}

const addIdReferenceToDoc = async (schemaToFind, docIds, referenceSchemas, referenceIds) => {
    // one doc to be updated with single user id
    if (!Array.isArray(docIds) && !Array.isArray(referenceIds)) {
        console.log('locating doc id: ' + docIds);
        await findDocByQuery(schemaToFind, "_id", docIds).then((doc) => {
            doc[referenceSchemas].push(referenceIds);
            doc.save();
        })
    // one doc to be updated with multiple user ids
    } else if (!Array.isArray(docIds) && Array.isArray(referenceIds)) {
        console.log('locating doc id: ' + docIds);

        for (let id in referenceIds) {
            await findDocByQuery(schemaToFind, "_id", docIds).then((doc) => {
                doc[referenceSchemas].push(id);
                doc.save();
            })
        }

    // multiple docs to be updated with single user id
    } else if (Array.isArray(docIds) && !Array.isArray(referenceIds)) {
        console.log('doc ids: ' + docIds);

        for (let id of docIds) {
            console.log("locating doc: " + id);
            await findDocByQuery(schemaToFind, "_id", id).then((doc) => {
                doc[referenceSchemas].push(referenceIds);
                doc.save();
            })
        }

    // multiple docs to be updated with multiple user ids
    } else {
        console.log('doc ids: ' + docIds);

        for (let id of docIds) {
            console.log("locating doc: " + id);
            await findDocByQuery(schema, "_id", id).then((doc) => {
                for(let userId in userIds) {
                    doc[referenceSchemas].push(userId);
                    doc.save();
                }
            })
        }
    }
}

// Finds user and uses their course ids and grabs corresponding objects from course collection
const getUserCourses = async (id) => {
    return new Promise((resolve, reject) => {
        schemas.User.findOne({ id: id }).lean()

        .populate('courses').exec((err, user) => {
            if (err) reject(err);
            resolve(user.courses);
        });
    });
}

const getCollectionDetails = async (schema, collection, id) => {
    return new Promise((resolve, reject) => {
        schema.findOne({ id: id }).lean()

        .populate(collection).exec((err, user) => {
            if (err) reject(err);
            resolve(user[collection]);
        });
    });
}

const getMultipleCollectionDetails = async (collections, id) => {
    return new Promise((resolve, reject) => {
        let details = [];
        if (!Array.isArray(collections)) {
            schemas.User.findOne({ "_id": id }).lean()

            .populate(collections).exec((err, user) => {
                if (err) reject(err);
                resolve(user[collections]);
            });
        } else {
           collections.forEach(collection => {
               schemas.User.findOne({ "_id": id }).lean()

                .populate(collection).exec((err, user) => {
                    if (err) reject(err);
                    details.push(
                        {
                            collection: collection,
                            details: user[collection]
                        }
                    );
                    
                    if (details.length == collections.length) {
                        resolve(details);
                    }
                });
           })
        }
    });
}

const getUsersWithType = async (userId, type) => {
    return new Promise((resolve, reject) => {
        // find each person with a type matching provided type
        schemas.User.find({ id: userId, type: { "$eq": type, "$exists": true } }, (err, user) => {
            if (err) reject(err);
            resolve(user);
        });
    });
}

const getClassIdsFromTeacherCourses = async (allTeacherCourses) => {
    let classIds = [];
    return new Promise((resolve, reject) => {
        for (let index = 0; index < allTeacherCourses.length; index++) {
            const course = allTeacherCourses[index];

            // console.log(course.classIds);
            classIds.push({ courseId: course.courseId, classIds: course.classIds });
            
            if(classIds.length == allTeacherCourses.length) {
                resolve(classIds);
            }
        }

    });
}

module.exports = {
    createDoc,
    createMultipleDocs,
    findDocByQuery,
    addIdReferenceToDoc,
    getUserCourses,
    getCollectionDetails,
    getMultipleCollectionDetails,
    getUsersWithType,
    getClassIdsFromTeacherCourses
};