const myDownloader = require("./../model/Downloader");
const Post = require("./../model/Post");

exports.home = function (req, res) {
  if (req.session.admin == "ok") {
    res.render("admin/admin-dashboard");
    // console.log(req.session.user);
  } else {
    res.render("admin/admin-login");
  }
};

exports.login = function (req, res) {
  if (req.body.username == "admin" && req.body.password == "admin") {
    req.session.admin = "ok";
    req.session.user = { username: "admin" };
    res.redirect("/admin");
  } else {
    res.render("admin/admin-login");
  }
};

exports.logout = function (req, res) {
  req.session.admin = "";
  req.session.user = "";
  res.redirect("/admin");
};

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.admin == "ok") {
    next();
  } else {
    res.send("you should login as admin");
  }
};

exports.startQueue = function (req, res) {
  myDownloader.module.download = true;
  myDownloader.module.startQueue();
  res.send("download started ...");
};

exports.stop = function (req, res) {
  mydownloader.module.download = false;
  res.send("downloading stoped !!!");
};

exports.deletePost = function (req, res) {
  new Post()
    .delete_post(req.query.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.send(err);
    });
};
