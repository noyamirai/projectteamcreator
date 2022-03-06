const express = require('express');
const app = express();
const port = 3000;

const handlebars = require('express-handlebars');
const paramCase = require('param-case');
const bodyParser = require('body-parser');

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

  CRUD.findDocByQuery(schemas.User, "username", req.params.username).then((user) => {
    // Get course information of user with their id
    CRUD.getCollectionDetails(schemas.User, 'courses', user.id).then((courses) => {
      // loop through array to get objects
      courses.forEach(course => {
        // create link for each course
        course.acronym = acronymGen.createAcronym(course.title);
      });
      res.render('courses-overview', { layout: "default", baseURL: baseURL, userData: user, courseData: courses });
    });
  });
});

app.get('/:username/courses/:course/classes', (req, res) => {
  let classData;
  let courseTitle;
  let courseAcr;

  CRUD.findDocByQuery(schemas.User, "username", req.params.username).then((user) => {

    CRUD.getMultipleCollectionDetails(['courses', 'classes'], user.id).then((collectionDetails) => {
      collectionDetails.forEach(item => {
        if(item.collection == 'classes') {
          classData = item.details;
        } else if (item.collection == "courses") {
          for (let index = 0; index < item.details.length; index++) {
            const element = item.details[index];
            element.acronym = acronymGen.createAcronym(element.title);
            if(element.linkRef == req.params.course) {
              courseTitle = element.title;
              courseAcr = element.acronym;
            }
          }
        }
      })

      res.render('classes-overview', { layout: "default", userData: user, courseAcr: courseAcr, courseTitle: courseTitle, classData: classData });
    })
  });
});

app.get('*', function(req, res){
  res.status(404).send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});