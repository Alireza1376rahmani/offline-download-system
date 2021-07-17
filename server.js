const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const router = require("./router");
const app = express();

let sessionOption = session({
    secret: "just a simple key",
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/odp" }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(express.json());
app.use(sessionOption);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.set("views", "view");
app.set("view engine", "ejs");

console.log("app is listening at port 3000 : ")
module.exports = app;
