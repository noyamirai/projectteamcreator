# :sparkles: Project Team Creator :sparkles:
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

PTC (Project Team Creator) is a browser based matching application, build to help teachers of CMD create well balanced teams for group assignments and/or projects. These teams will be generated based on the CMD skills types of students.

## :zap: Quickstart
 If you want to start working with on PTC, and you have cloned this repo to your desktop, go to its root directory and run `npm install` to install its dependencies.

Now that we are all on the same page, it is time to connect a database to your project. In the `config` folder you will find a file called `db.js`. This is where you establish the connection with your database. In order to establish the connection, you need a `.env` file in the root of your project. Your `.env` file should then (at least for the database connection) contain the following information:

~~~
DB_USER= your database user
DB_NAME= your database name
DB_PASS= your database password
~~~

As of now, we do not have a base JSON file with dummy data you could import into your database, but we're working on it :wink:

---

Now that you're ready to ***really*** get started, type `npm start` to start the application. You will then be able to access it at localhost:3000. Running this prompt should result in the following:

~~~
$ npm start

> projectteamcreator@1.0.0 start
> nodemon server.js

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Server running at http://localhost:3000/
DB connected
~~~

That's it! Have any trouble? Feel free to let us know by submitting an issue. (no e-mail yet :stuck_out_tongue:)

## :eyes: Usage (code examples)
Listed below are some of the common examples with our CRUD operations.

### createDoc(schema, object)
Running this operation will save a new `object` (or also known as document in MongoDb) inside the specified collection based on it's `schema` and then return said object.

~~~
const CRUD = require('./controller/crud-operations');
CRUD.createDoc({ title: "Project Tech" });
~~~

### createMultipleDocs(schema, objects)
Running this operation will save multiple `objects` inside the specified collection based on it's `schema`

~~~
const CRUD = require('./controller/crud-operations');
CRUD.createMultipleDocs(schemas.Course, [{title: "Front-end Development"}, {title: "Project Tech"}]);
~~~

### findDocByQuery(schema, property, equalTo)
Running this operation will find and then return a document based on which `property` it should be equal to.

~~~
const CRUD = require('./controller/crud-operations');
CRUD.findDocByQuery(schema.Course, "title", "Project Tech");
~~~

### updateDocWithUserId(schema, docIds, userId)
Running this operation will first call `findDocByQuery` with `docIds` and then add the provided `userId` to its `users` property.

~~~
const CRUD = require('./controller/crud-operations');
CRUD.createDoc(schemas.User,
    {
      name: {
        firstName: "Pietje",
        lastName: "Boer"
      },
      username: "p-boer",
      type: "student",
      courses: [ids],
      classes: [ids]
    }
  ).then((result) => {
    CRUD.updateDocWithUserId(schemas.Course, result.courses, result.id);
    CRUD.updateDocWithUserId(schemas.Class, result.classes, result.id);
  });
~~~

### getCollectionDetails(schema, collection, id)
Running this operation will find the user by their `id` and then grabs corresponding objects from specified `collection`


~~~
const CRUD = require('./controller/crud-operations');
CRUD.findDocByQuery(schemas.User, "username",  "stinky").then((user) => {
    // Get course information of user with their id
    CRUD.getCollectionDetails(schemas.User, 'courses', user.id).then((courses) => {
      console.log(courses);
    });
  });
~~~

### getMultipleCollectionDetails(collections, id)
Running this operation will allow you to grab corresponding objects from multiple specified `collections`

~~~
const CRUD = require('./controller/crud-operations');
CRUD.findDocByQuery(schemas.User, "username", "stinky").then((user) => {
    CRUD.getMultipleCollectionDetails(['courses', 'classes'], user.id).then((collectionDetails) => {
      collectionDetails.forEach(item => {
        console.log(item);
      })
    });
  });
~~~

### createAcronym(string)
Running this function will create an acronym with the first two letters of the provied `string`

~~~
const acronymGen = require('./public/js/acronym-generator');
let acronym = acronymGen.createAcronym("Front-end Development");

RESULT:
FD
~~~

## Documentation

Learn more about PTC and dive deeper into this project by reading the process documentation in our [wiki](https://github.com/noyamirai/projectteamcreator/wiki).

## :warning: License

This project is licensed under the terms of the MIT license.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/noyamirai/projectteamcreator/blob/main/LICENSE)

