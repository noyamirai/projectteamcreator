const { log } = require('async');
const express = require('express');
const app = express();
const port = 3000;

const handlebars = require('express-handlebars');
const db = require('./config/db');

app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  defaultLayout: "default",
  extname: 'hbs'
}));

app.use('/public', express.static('public'));

db.connectDb();

app.get('/', async (req, res, next) => {
  // const user = db.getUserByLastName("Spier").then((user) => { user });
  res.render('courses-overview', {layout : "default"});

  // let func = await db.getCourseIdByTitle(["Front-end Development", "Project Tech"]);
  // console.log(func);

  // db.getCourseIdByTitle('Project Tech').then((id) => { 
  //   console.log(id); 
  // });

  // db.getCourseIdByTitle("Project Tech").then((id) => {
  //   db.createUser({
  //     firstname: "Ivo", 
  //     lastname: "Nijhuis", 
  //     type: "teacher", 
  //     given_courses: id
  //   });
  // });
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