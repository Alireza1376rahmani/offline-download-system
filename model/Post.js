const db = require("./../db");
const postCollection = db.collection("posts");
const ObjectId = require("mongodb").ObjectID;

let Post = function (data) {
	this.data = data;
	// console.log(this.data);
};

Post.prototype.store = function () {
	return new Promise((resolve, reject) => {
		postCollection.insertOne(this.data, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve("post created successfully");
			}
		});
	});
};

Post.prototype.getFilePath = function (id) {
	return new Promise((resolve, reject) => {
		postCollection.findOne({ _id: ObjectId(id) }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result.filePath);
			}
		});
	});
};

Post.prototype.delete_post = function (id) {
	return new Promise((resolve, reject) => {
		postCollection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve("post deleted successfully !!!");
			}
		});
	});
};

Post.prototype.getUploader = function () {
	const multer = require("multer");

	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "./public/uploads/posters");
		},
		filename: function (req, file, cb) {
			let the =
				new Date().toString().split(":").join("-") + file.originalname;
			//   new Date().toString().replaceAll(":", "-") + "_" + file.originalname;
			//   console.log(the);
			cb(null, the);
		},
	});

	const fileFilter = (req, file, cb) => {
		// reject a file
		if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
			cb(null, true);
		} else {
			cb(new Error("choose jpeg or png file"), false);
		}
	};

	let upload = multer({
		storage: storage,
		limits: {
			fileSize: 1024 * 1024 * 5,
		},
		fileFilter: fileFilter,
	});
	return upload;
};


module.exports = Post;
