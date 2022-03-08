const CRUD = require('../controller/crud-operations');
const schemas = require('../models/schemas');
const uniqid = require('uniqid'); 
const paramCase = require('param-case');
const db = require('../config/db');
db.connectDb();
// db.emptyDb();

// CRUD.createMultipleDocs(schemas.Course, [
//     {
//         courseId: uniqid(),
//         title: "Project Tech",
//         linkRef: paramCase.paramCase("Project Tech")
//     },
//     {
//         courseId: uniqid(),
//         title: "Front-end Development",
//         linkRef: paramCase.paramCase("Front-end Development")
//     },
//     {
//         courseId: uniqid(),
//         title: "Back-end Development",
//         linkRef: paramCase.paramCase("Back-end Development")
//     },
//     {
//         courseId: uniqid(),
//         title: "Front-end voor Designers",
//         linkRef: paramCase.paramCase("Front-end voor Designers")
//     },
//     {
//         courseId: uniqid(),
//         title: "Audio Visueel Design",
//         linkRef: paramCase.paramCase("Audio Visueel Design")
//     }
// ]);

// CRUD.createMultipleDocs(schemas.Class, [
//     {
//         classId: uniqid(),
//         title: "Tech-1",
//         courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762"]
//     },
//     {
//         classId: uniqid(),
//         title: "Tech-2",
//         courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762"]
//     },
//     {
//         classId: uniqid(),
//         title: "Tech-3",
//         courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762"]
//     },
//     {
//         classId: uniqid(),
//         title: "FVD-1",
//         courses: ["62262185069e1b49c94b3763"]
//     },
//     {
//         classId: uniqid(),
//         title: "AV-1",
//         courses: ["62262185069e1b49c94b3764"]
//     }
// ]).then((result) => {
//     for(let classObject of result) {
//         CRUD.addIdReferenceToDoc(schemas.Course, classObject.courses, "classes", classObject.id).then(console.log('DONE!'));
//     }
// });

CRUD.createMultipleDocs(schemas.User, [
    {
        userId: uniqid(),
        username: "roberrrt-s",
        email: "atest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Robert",
            last: "Spier"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/6113643?v=4",
        courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761"],
        classes: [],
        type: "teacher",
        is_admin: false
    },
    {
        userId: uniqid(),
        username: "dandevri",
        email: "btest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Danny",
            insertion: "de",
            last: "Vries"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/22084444?v=4",
        courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762"],
        classes: [],
        type: "teacher",
        is_admin: false
    },{
        userId: uniqid(),
        username: "rouws",
        email: "ctest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Sonja",
            last: "Rouwhorst"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/2169878?v=4",
        courses: ["62262185069e1b49c94b3762"],
        classes: [],
        type: "teacher",
        is_admin: false
    },{
        userId: uniqid(),
        username: "ivo-online",
        email: "dtest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Ivo",
            last: "Nijhuis"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/75486733?v=4",
        courses: ["62262185069e1b49c94b3760"],
        classes: [],
        type: "teacher",
        is_admin: false
    },{
        userId: uniqid(),
        username: "ikizm001",
        email: "etest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Maijla",
            last: "Ikiz"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/90140220?v=4",
        courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762", "62262185069e1b49c94b3763"],
        classes: ["622621c229298d65c028b3b6", "622621c229298d65c028b3b8"],
        type: "student",
        is_admin: true
    },
    {
        userId: uniqid(),
        username: "ksasja001",
        email: "ftest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Sasja",
            last: "Koning"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/90140220?v=4",
        courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762", "62262185069e1b49c94b3764"],
        classes: ["622621c229298d65c028b3b6", "622621c229298d65c028b3b9"],
        type: "student",
        is_admin: false
    },
    {
        userId: uniqid(),
        username: "gchris001",
        email: "gtest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Chris",
            last: "Gabriel III"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/90140220?v=4",
        courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762", "62262185069e1b49c94b3764"],
        classes: ["622621c229298d65c028b3b6", "622621c229298d65c028b3b9"],
        type: "student",
        is_admin: false
    },
    {
        userId: uniqid(),
        username: "bluka001",
        email: "htest@hva.nl",
        password: "stinkypassword",
        name: {
            first: "Luka",
            last: "Bronius"
        },
        profile_pic: "https://avatars.githubusercontent.com/u/90140220?v=4",
        courses: ["62262185069e1b49c94b3760", "62262185069e1b49c94b3761", "62262185069e1b49c94b3762", "62262185069e1b49c94b3764"],
        classes: ["622621c229298d65c028b3b6", "622621c229298d65c028b3b9"],
        type: "student",
        is_admin: false
    }
]).then((result) => {
    for(let userObject of result) {
        if(userObject.type == "teacher"){
            console.log(userObject);
            userObject.courses.forEach(courseId => {
                console.log(courseId);
                CRUD.createDoc(schemas.TeacherCourse, { userId: userObject.id, courseId: courseId })
            })
        }
        CRUD.addIdReferenceToDoc(schemas.Course, userObject.courses, "users", userObject.id);
        CRUD.addIdReferenceToDoc(schemas.Class, userObject.classes, "users", userObject.id);
    }
});