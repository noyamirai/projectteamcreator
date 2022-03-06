const { log } = require('async');
const express = require('express');
const app = express();
const port = 3000;

const handlebars = require('express-handlebars');

const db = require('./config/db');

const courseCRUD = require('./controller/course-crud');
const userCRUD = require('./controller/user-crud');

app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: "default",
  extname: 'hbs'
}));

app.use('/public', express.static('public'));

db.connectDb();

app.get('/', (req, res) => {
  // to-do: error handling here
  userCRUD.findUserByQuery("name.lastName", "Spier").then((user) => {
    userCRUD.getUserCourses(user.id).then((courses) => {
      res.render('courses-overview', { layout: "default", userData: user, courseData: courses });
    });
  });

  // courseCRUD.createCourse({ title: "Front-end Development" })
  
  // courseCRUD.getCourseIdByTitle(["Project Tech", "Front-end Development"]).then((id) => {
  //   userCRUD.createUser({
  //     name: {
  //       firstName: "Maijla",
  //       lastName: "Ikiz",
  //     },
  //     type: "student", 
  //     courses: id
  //   }).then((userDoc) => {
  //     const userCourses = userDoc.courses;
  //     userCourses.forEach(course => {
  //       console.log('updating course with id: ' + course);
  //       courseCRUD.findCourseByQuery("id", course).then((courseDoc) => {
  //         console.log('course found. adding user: ' + userDoc.id);
  //         // courseDoc.users.push(userDoc.id);
  //         // courseDoc.save();
  //       })
  //     });
  //   })
  // });
  // courseCRUD.getCourseIdByTitle(["Project Tech", "Front-end Development"]).then((id) => {
  //   userCRUD.createUser({
  //     name: {
  //       firstName: "Maijla",
  //       lastName: "Ikiz",
  //     },
  //     type: "student", 
  //     courses: id
  //   })
  // });
    userCRUD.findUserByQuery("name.lastName", "Ikiz").then((user) => {
      const courseIds = user.courses;
      const userId = user.id;
      userCRUD.updateUserCourse(courseIds, userId);
    })

  // courseCRUD.findCourseByQuery("_id", "62226c58315e5ab16891293e")
});

app.get('/classes', (req, res) => {
  res.render('classes-overview', {layout : "default"});
});

app.get('/class-details', (req, res) => {
  res.render('class-details', {layout : "default-yellow"});
});

app.get('*', function(req, res){
  res.status(404).send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});