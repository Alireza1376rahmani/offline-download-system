const db = require("./../db");
const postCollection = db.collection("posts");
const Download_konande = require("nodejs-file-downloader");

let Downloader = function () {
	console.log("downloader created");
	this.download = false;
};

Downloader.prototype.downloadFile = async function (request) {
	let saveTo = `./downloads/${request._id.toString()}`;
	let fileName = "";
	const downloader = new Download_konande({
		url: request.link,
		directory: saveTo, //This folder will be created, if it doesn't exist.
		onBeforeSave: (deducedName) => {
			console.log(`The file name is: ${deducedName}`);
			fileName = deducedName;
		},
	});
	try {
		await downloader.download();
		console.log(`${fileName} downloaded`);
		await postCollection.updateOne(
			{ _id: request._id },
			{
				$set: {
					isDownloaded: true,
					filePath: [saveTo, fileName].join("/"),
				},
			},
			(err, result) => {
				if (err) {
					console.log("database error : ", err);
				}
			}
		);
	} catch (error) {
		//IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
		//Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
		console.log("Download failed", error);
	}
};

Downloader.prototype.startQueue = function () {
	// console.log("start queue started !!!");
	postCollection.find({ isDownloaded: false }).toArray((err, items) => {
		// make a list of undownloaded items and download them till the end or download variable get false
		items.forEach((item) => {
			if (this.download) {
				// Download and update the item
				this.downloadFile(item);
			}
		});
	});
};

Downloader.prototype.getDownloadedPosts = function () {
	return new Promise((resolve, reject) => {
		postCollection.find({ isDownloaded: true }).toArray((err, items) => {
			//   console.log(items);
			//   console.log(items.length)
			resolve(items);
		});
	});
};

Downloader.prototype.getSearchedItems = function (s) {
	return new Promise((resolve, reject) => {
		// let query = { address: /^S/ }
		postCollection.find({ isDownloaded: true }).toArray((err, items) => {
			if (err) {
				reject(err);
			}
			let q1 = [];
			let q2 = [];

			items.forEach((item) => {
				if (item.title.toLowerCase().search(s.toLowerCase()) + 1) {
					q1.push(item);
				} else if (item.description.search(s) + 1) {
					q2.push(item);
				}
			});

			resolve(q1.concat(q2));
		});
	});
};

// let theDownloader = new Downloader();
exports.module = new Downloader();
