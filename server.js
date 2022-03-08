const express = require('express');
const app = express();
const port = 3000;

const handlebars = require('express-handlebars');
const paramCase = require('param-case');
const bodyParser = require('body-parser');

const rootPath = require('path');
global.appRoot = rootPath.resolve(__dirname);

const db = require('./config/db');

const acronymGen = require('./public/js/acronym-generator');
const CRUD = require('./controller/crud-operations');
const schemas = require('./models/schemas');

app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: "default",
  extname: 'hbs'
}));

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded());

db.connectDb();

app.get('/', (req, res) => {
  res.render('courses-overview', { layout: "default", userData: null, courseData: null });

  // CRUD.findDocByQuery(schemas.User, "name.lastName", "Ikiz").then((user) => {
  //   CRUD.getMultipleCollectionDetails(['courses', 'classes'], user.id).then((collectionDetails) => {
  //     collectionDetails.forEach(item => {
  //       if(item.collection == 'courses') {
  //         console.log(item);
  //       }
  //     })
  //   });
  // });

  // CRUD.createDoc(schemas.User,
  //   {
  //     name: {
  //       firstName: "Robert",
  //       lastName: "Spier"
  //     },
  //     username: "r-spier",
  //     type: "teacher",
  //     courses: ["6224bcc77bf06ea7c585fa27", "6224bcc77bf06ea7c585fa28"],
  //     classes: ["6224c923e7640efb9f228d42", "6224c923e7640efb9f228d43", "6224c923e7640efb9f228d44"]
  //   }
  // ).then((result) => {
  //   CRUD.updateDocWithUserId(schemas.Course, result.courses, result.id);
  //   CRUD.updateDocWithUserId(schemas.Class, result.classes, result.id);
  // });

  // CRUD.createMultipleDocs(schemas.Course, [
  //   {
  //     title: "Front-end Development",
  //     users: ["6224f3f3ac61ae236e27e94f"],
  //     classes: ["6224c923e7640efb9f228d42", "6224c923e7640efb9f228d43", "6224c923e7640efb9f228d44"]
  //   },
  //   {
  //     title: "Project Tech",
  //     users: ["6224f3f3ac61ae236e27e94f"],
  //     classes: ["6224c923e7640efb9f228d42", "6224c923e7640efb9f228d43", "6224c923e7640efb9f228d44"]
  //   },
  //   {
  //     title: "Front-end voor Designers"
  //   }
  // ])
});

app.get('/:username/courses', (req, res) => {
  const baseURL = req.path;

  CRUD.findDocByQuery(schemas.User, "username", req.params.username).then((userData) => {
    schemas.TeacherCourse.find({ "userId": userData.id }).lean().populate('courseId').exec(function (err, courseData) { 
      courseData.forEach(course => {
        course.acronym = acronymGen.createAcronym(course.courseId.title);
      })
      res.render('courses-overview', { layout: "default", root: global.appRoot, baseURL: baseURL, userData: userData, courseData: courseData});
    });
  });
});

app.get('/:username/courses/:course/classes', (req, res) => {
  CRUD.findDocByQuery(schemas.Course, "linkRef", req.params.course).then((paramCourse) => {
    console.log('found course from url: ' + paramCourse.linkRef);

    CRUD.findDocByQuery(schemas.User, "username", req.params.username).then((user) => {
      console.log('retreived user: ' + user.username);
      
      schemas.TeacherCourse.find({ "userId": user.id }, (err, allTeacherCourses) => {
        if (err) Promise.reject(err);
        console.log('we are looking for the id from paramCourse: ' + paramCourse.id);

        allTeacherCourses.forEach(teacherCourse => {
          if(teacherCourse.courseId ==  paramCourse.id) {
            console.log("found paramCourse in TeacherCourse collection ");

            schemas.Class.find({ "_id": { $in: teacherCourse.classIds}}, (err, classData) => {
              console.log(classData);
              res.render('classes-overview', { layout: "default", root: global.appRoot, userData: user, courseData: paramCourse, courseTitle: paramCourse.title, classData: classData});
            }).lean();
          }
        });
      });
    })  
  })
});

app.get('*', function(req, res){
  res.status(404).send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});