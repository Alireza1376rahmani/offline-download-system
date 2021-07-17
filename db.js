const mongo = require("mongodb").MongoClient;

let _db;

mongo.connect(
    "mongodb://localhost:27017",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    function (err, client) {
        _db = client.db("odp");
        // console.log(_db);
        module.exports = _db;

        const app = require("./server");
        app.listen(3000);
        // console.log(err);
    }
);

