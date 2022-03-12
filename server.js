const express = require('express');
const util = require('util')

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
      res.render('courses-overview', { layout: "default", profile_pic: userData.profile_pic, userName: userData.name.first + " " + userData.name.last ,root: global.appRoot, baseURL: baseURL, userData: userData, courseData: courseData});
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
              
              res.render('classes-overview', { layout: "default", root: global.appRoot, prevURL: '/' + req.params.username + '/courses/', baseURL: baseURL, userData: user, courseData: paramCourse, bannerTitle: paramCourse.title, bannerSubtitle: "Klassenoverzicht", classData: classData });

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
        res.render('class-details', { layout: "default-yellow", baseURL: baseURL, root: global.appRoot, prevURL: '/' + req.params.username + '/courses/' + req.params.course + '/classes', userData: classData.students, bannerTitle: classData.title, bannerSubtitle: classData.students.length + " studenten", courseData: courseData, linkRef: classObject.linkRef, classTeams: classObject.teams, className: "form" });

      });
    });
  });
});

app.get('/:username/courses/:course/classes/:class/home', function(req, res){
  const baseURL = req.path;

  CRUD.findDocByQuery(schemas.Class, "linkRef", req.params.class).then((classObject) => {
    // insert user info based on id  
    res.render('class-home', { layout: "default-yellow", baseURL: baseURL, root: global.appRoot, prevURL: '/' + req.params.username + '/courses/' + req.params.course + '/classes', bannerTitle: classObject.title, bannerSubtitle: classObject.students.length + " studenten", linkRef: classObject.linkRef });

  });
});

app.post('/:username/courses/:course/classes/:class/teams/team-generation', (req, res) => {
  let allStudentObjects = [];
  let allTeams = [];
  const teamSize = req.body.teamSize;
  const baseURL = req.path;

  schemas.Team.remove(function (err) {
    console.log("deleted");
  });

  schemas.Class.updateMany(
    { title: "Tech-2" },
    { $set: { teams: [] } },
    (err, affected) => {
      console.log("affected", affected)
    }
  )

  schemas.Student.updateMany(
    { },
    { $set: { teams: [] } },
    (err, affected) => {
      console.log("affected", affected)
    }
  )

  // get class object
  CRUD.findDocByQuery(schemas.Class, "linkRef", req.params.class).then((classObject) => {

    // get course object
    CRUD.findDocByQuery(schemas.Course, "linkRef", req.params.course).then((courseData) => {

      // get all class info
      schemas.Class.findById(classObject.id).lean().populate({ path: "students", populate: { path: "user" } }).exec((err, classData) => {

        allStudentObjects = classData.students;

        // generate teams with all students
        team.generate(allStudentObjects, teamSize).then((generatedTeams) => {

          // add each team into database and add reference ids to class and student schemas
          generatedTeams.forEach(team => {
            
            // adding team to team collection
            CRUD.createDoc(schemas.Team, { name: team.name, number: team.number, students: team.students, class: classObject.id, course: courseData.id }).then((doc) => {
              
              CRUD.addIdReferenceToDoc(schemas.Class, classObject._id, "teams", doc._id);
              doc.students.forEach(object => {
                CRUD.addIdReferenceToDoc(schemas.Student, object.student._id, "teams", doc._id);
              })

              // populate team details with student info
              schemas.Team.findById(doc.id).lean()
              .populate([{ 
                path: "students.student", 
                select: 'user', 
                  populate: { 
                    path: "user", 
                    select: 'name profile_pic' 
                  }
                }, {
                  path: "students.cmd_skill",
                  select: "skill"
                }
              ]).exec((err, teamData) => {
              
                // console.log(util.inspect(teamData, false, null, true));
                allTeams.push(teamData);

                if (allTeams.length === generatedTeams.length) {
                  console.log('done?');
                  
                  res.render('team-details', {
                    layout: "default-yellow",
                    baseURL: baseURL,
                    root: global.appRoot,
                    allTeams: allTeams.sort((a, b) => parseFloat(a.number) - parseFloat(b.number)),
                    userData: null,
                    courseData: null,
                    memberView: false
                  });
                }
              });

            });
          });
        })
      });
    });
  });
});


app.get('/:username/courses/:course/classes/:class/teams', function(req, res){
  const baseURL = req.path;

  CRUD.findDocByQuery(schemas.Class, "linkRef", req.params.class).then((classObject) => {
    console.log(classObject);

    schemas.Class.findById(classObject.id).lean().populate({ path: "teams", select: "name students number"}).exec((err, classData) => {
      console.log(classData);

      res.render('team-overview', 
      { layout: "default", 
        root: global.appRoot, 
        prevURL: '/' + req.params.username + '/courses/' + req.params.course + '/classes/' + req.params.class + '/home',
        baseURL: baseURL, 
        userData: null, 
        teamData: classData.teams.sort((a, b) => parseFloat(a.number) - parseFloat(b.number)), 
        bannerTitle: classData.title, 
        bannerSubtitle: "Team overzicht",
        className: "form" });
    });
  });
});

app.get('/:username/courses/:course/classes/:class/teams/:number/overview', function(req, res){
  const baseURL = req.path;

  CRUD.findDocByQuery(schemas.Team, "number", req.params.number).then((teamObject) => {
    // console.log(teamObject);

    schemas.Team.findById(teamObject.id).lean().populate([{
      path: "students.student",
      select: 'user',
      populate: {
        path: "user",
        select: 'name profile_pic'
      }
    }, {
      path: "students.cmd_skill",
      select: "skill"
    }
    ]).exec((err, teamData) => {
      teamData.students.forEach(object => {
        console.log(object.student.user.name.first);
      })
      console.log(teamObject);
      res.render('team-details', { layout: "default-yellow", memberView: true, baseURL: baseURL, studentData: teamData.students,  prevURL: '/' + req.params.username + '/courses/' + req.params.course + '/classes/' + req.params.class + '/teams', bannerTitle: teamObject.name, bannerSubtitle: "Team overzicht"});

    });
  });

});

app.get('/team-reset', function(req, res){
  res.render('courses-overview', { layout: "default" });

  schemas.Team.remove(function (err) {
    console.log("deleted");
  });

  schemas.Class.updateMany(
    { title: "Tech-2" },
    { $set: { teams: [] } },
    (err, affected) => {
      console.log("affected", affected)
    }
  )

  schemas.Student.updateMany(
    {},
    { $set: { teams: [] } },
    (err, affected) => {
      console.log("affected", affected)
    }
  )
  console.log('reset!');
});

app.get('*', function(req, res){
  res.status(404).send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});