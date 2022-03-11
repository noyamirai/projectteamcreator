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
const team = require('./controller/team-generator');
const schemas = require('./models/schemas');

app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: "default",
  extname: 'hbs'
}));

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.connectDb();

app.get('/', (req, res) => {
  res.render('courses-overview', { layout: "default", userData: null, courseData: null });
});

app.get('/:username/courses', (req, res) => {
  const baseURL = req.path;

  CRUD.findDocByQuery(schemas.User, "username", req.params.username).then((userData) => {
    schemas.TeacherCourse.find({ "userId": userData.id }).lean().populate('course').exec(function (err, courseData) { 
      console.log(courseData);
      courseData.forEach(doc => {
        doc.acronym = acronymGen.createAcronym(doc.course.title);
      })
      res.render('courses-overview', { layout: "default", root: global.appRoot, baseURL: baseURL, userData: userData, courseData: courseData});
    });
  });
});

app.get('/:username/courses/:course/classes', (req, res) => {
  const baseURL = req.path;

  CRUD.findDocByQuery(schemas.Course, "linkRef", req.params.course).then((paramCourse) => {
    console.log('found course from url: ' + paramCourse.linkRef);

    CRUD.findDocByQuery(schemas.User, "username", req.params.username).then((user) => {
      console.log('retreived user: ' + user.username);
      
      schemas.TeacherCourse.find({ "userId": user.id }, (err, allTeacherCourses) => {
        if (err) Promise.reject(err);
        console.log('we are looking for the id from paramCourse: ' + paramCourse.id);

        allTeacherCourses.forEach(teacherCourse => {
          if(teacherCourse.course ==  paramCourse.id) {
            console.log("found paramCourse in TeacherCourse collection ");

            schemas.Class.find({ "_id": { $in: teacherCourse.classes}}, (err, classData) => {
              console.log(classData);
              res.render('classes-overview', { layout: "default", root: global.appRoot, prevURL: '/' + req.params.username + '/courses/', baseURL: baseURL, userData: user, courseData: paramCourse, bannerTitle: paramCourse.title, bannerSubtitle: "Klassenoverzicht", classData: classData});
            }).lean();
          }
        });
      });
    })  
  })
});

app.get('/:username/courses/:course/classes/:class', function(req, res){
  const baseURL = req.path;
  // get course object
  CRUD.findDocByQuery(schemas.Course, "linkRef", req.params.course).then((courseData) => {
    // get class object
    CRUD.findDocByQuery(schemas.Class, "linkRef", req.params.class).then((classObject) => {
      // insert user info based on id      
      schemas.Class.findById(classObject.id).lean().populate({ path: "students", populate: { path: "user"}}).exec((err, classData) => { 
        console.log(classData);
        res.render('class-details', { layout: "default-yellow", baseURL: baseURL, root: global.appRoot, prevURL: '/' + req.params.username + '/courses/' + req.params.course + '/classes', userData: classData.students, bannerTitle: classData.title, bannerSubtitle: classData.students.length + " studenten", courseData: courseData, classData: classData, className: "form"});
      });
    });
  });
});

app.post('/:username/courses/:course/classes/:class/team-generation', (req, res) => {
  res.render('courses-overview', { layout: "default", userData: null, courseData: null });
  let allTeams = [];
  let allStudentObjects = [];
  let counter = 0;

  const teamSize = req.body.teamSize;
  const sameTeam = req.body.sameTeam;

  CRUD.findDocByQuery(schemas.Class, "linkRef", req.params.class).then((classObject) => {
    schemas.Class.findById(classObject.id).lean().populate({ path: "students", populate: { path: "user"}}).exec((err, classData) => { 
      
      allStudentObjects = classData.students;
      team.generate(allStudentObjects, teamSize);
        // CRUD.createDoc(schemas.Team, { name: `team-${counter}`, students: array of ids, class: classObject.id, course: })
    });
  });

  // get all students from :class (allStudentObjects)
  // insert teamSize amount of students(_id) in teamObject(students:) where CMD skills are all different, and remove from allStudentObjects array
  // when teamObject students.length == teamSize.length (or if no more students left in allStudentsObject), insert teamObject into allTeams[]
  // when all students are inside a team, insert allTeams into teams collection

});

app.get('*', function(req, res){
  res.status(404).send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});