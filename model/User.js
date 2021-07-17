const db = require("./../db");
const userCollection = db.collection("users");
const postCollection = db.collection("posts")

let User = function (data) {
    this.data = data;
    // console.log("from User constructor : "+ this.data.username)
};

User.prototype.login = function () {
    // console.log(this.data.username)
    return new Promise((resolve, reject) => {
        userCollection
            .find({ username: this.data.username })
            .toArray((err, items) => {
                let s = 1;
                items.forEach((item) => {
                    if (
                        item.username == this.data.username &&
                        item.password == this.data.password
                    ) {
                        resolve("this account exist");
                        s = 0;
                    }
                });
                if (s) {
                    reject("there is no user with this information");
                }
            });
    });
};

User.prototype.signup = function () {
    return new Promise((resolve, reject) => {
        let usernames;
        userCollection.find({}).toArray((err, items) => {
            if (err) {
                reject(err);
            }
            // console.log('items :');
            // console.log(items)
            usernames = items.map((item) => {
                return item.username;
            });
            if (usernames.indexOf(this.data.username) == -1) {
                this.data.profile = "default.jpg";
                userCollection.insertOne(this.data, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve("account created");
                });
            } else {
                reject(
                    "there is an account with same username !!! \n please try with another username "
                );
            }
        });
    });
};

User.prototype.getUploader = function () {
    const multer = require("multer");  

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/uploads/profiles");
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

User.prototype.changePhoto = function (newPhoto) {
    console.log("in User :");
    console.log(newPhoto);
    console.log(this.data.username);
    userCollection.updateOne(
        { username: this.data.username },
        { $set: { profile: newPhoto } },
        (err, result) => {
            if (err) {
                console.error(err);
            }
        }
    );
};

User.prototype.getPhoto = function (username) {
    return new Promise((resolve, reject) => {
        userCollection.find({ username: username }).toArray((err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log(result);
                resolve(result[0].profile);
            }
        });
    });
};

User.prototype.getMyPosts = function (username) {
    return new Promise((resolve, reject) => {
        postCollection.find({ owner: username }).toArray((err, result)=>{
            if(err){
                reject(err);
            }else{
                console.log(result);
                resolve(result)
            }
        })
    })
}

module.exports = User;
