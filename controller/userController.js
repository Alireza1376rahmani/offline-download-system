const User = require("./../model/User");
const myDownloader = require("./../model/Downloader");

exports.home = async function (req, res) {
	if (req.session.user) {
		let isAdmin;
		if (req.session.admin) {
			isAdmin = true;
		} else {
			isAdmin = false;
		}

		new User()
			.getPhoto(req.session.user.username)
			.then(function (photo) {
				myDownloader.module
					.getDownloadedPosts()
					.then((posts) => {
						// console.log("the files returs : ", posts);
						res.render("main-viewer", {
							username: req.session.user.username,
							posts: posts,
							admin: isAdmin,
							profile: photo,
						});
					})
					.catch((err) => {
						console.error(err);
					});
			})
			.catch((err) => {
				console.error(err);
			});
		// console.log(req.session.user);
	} else {
		res.render("sign-page");
	}
};

exports.login = function (req, res) {
	let user = new User(req.body);
	// console.log(req.body);
	user.login()
		.then((result) => {
			// set session info
			req.session.user = { username: user.data.username };
			res.redirect("/");
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect("/");
};

exports.signup = function (req, res) {
	let user = new User(req.body);
	user.signup()
		.then((r) => {
			user.login()
				.then((result) => {
					req.session.user = { username: user.data.username };
					res.redirect("/");
				})
				.catch((e) => console.log(e));
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.mustBeLoggedIn = function (req, res, next) {
	if (req.session.user ) {
		next();
	} else {
		// console.log("trying to get into site without logging in")
		res.redirect("/");
	}
};

exports.getUploader = function (req, res) {
	return new User().getUploader();
};

exports.uploadProfile = function (req, res) {
	// console.log(req.file.filename);
	// console.log(req.session.user.username);
	new User({ username: req.session.user.username }).changePhoto(
		req.file.filename
	);
	res.redirect("/");
};

exports.changeProfilePage = function (req, res) {
	res.send(`
  <form action="/upload-profile" method="POST" enctype="multipart/form-data">
        <input type="file" name="profile">
        <input type="submit">
    </form>
  `);
};

exports.dashboardPage = async function (req, res) {
	let posts = await new User().getMyPosts(req.session.user.username);

	new User()
		.getPhoto(req.session.user.username)
		.then(function (photo) {
			res.render("dashboard", {
				username: req.session.user.username,
				posts: posts,
				profile: photo,
			});
		})
		.catch((err) => {
			console.error(err);
		});
	// console.log('from usercontroller',posts)
};
