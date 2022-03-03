require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@teamcreator-db.9p0bn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const connectDb = async () => {
    try {
        await client.connect();
        console.log("Db correctly connected to server");

        // const users = client.db(`${process.env.DB_NAME}`).collection("users");

        // users.insertOne( {
        //     name: { "first": "Stinky", "insertion": "hehe", "last": "Achternaam" },
        //     type: "Student",
        //     admin: false
        // });

        // const doc = await users.findOne();
        // console.log(doc);

    } catch (err) {
        console.log(`error occured while trying to connect to db: ${err}`);
        throw err;
    }
}

module.exports = connectDb;
