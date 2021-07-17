const Post = require("./../model/Post");
const downloader = require("./../model/Downloader");
const User = require("./../model/User");

exports.create = function (req, res) {
	res.render("new-post");
};

exports.newRequest = function (req, res) {
	let data = req.body;
	data["owner"] = req.session.user.username;
	data["isDownloaded"] = false;
	data["poster"] = req.file.filename;
	let post = new Post(data);
	post.store()
		.then((result) => {
			res.redirect("/dashboard");
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.download = function (req, res) {
	new Post({})
		.getFilePath(req.query.id)
		.then((path) => {
			//   console.log("from controller   path :", path);
			var n = path.lastIndexOf("/");
			var result = path.substring(n + 1);
			//   console.log(result);
			res.download(path, result);
			// res.sendFile("./../downloads/60a3f402655e5c872ce8b182/Homayoun-Shajarian.Morghe-Sahar(128)_3.mp3");
		})
		.catch((err) => {
			console.log(err);
		});
	//   res.send("ok");
};

exports.getUploader = function (req, res) {
	return new Post().getUploader();
};

exports.search = function (req, res) {
	downloader.module
		.getSearchedItems(req.body.s)
		.then((items) => {
			new User()
				.getPhoto(req.session.user.username)
				.then(function (photo) {
					res.render("main-viewer", {
						username: req.session.user.username,
						posts: items,
						admin: req.session.admin,
						profile: photo,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
};
