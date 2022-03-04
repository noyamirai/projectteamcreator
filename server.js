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

app.get('/', (req, res) => {
  res.render('courses-overview', {layout : "default"});
  // db.createCourse("Stinky course");
  // YASSSSS

  // db.createManyCourses(["stinky 1", "stinky 2", "stinky 3"]);
  // db.createUser({firstname: "Robert", lastname: "Spier", type: "teacher"});
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