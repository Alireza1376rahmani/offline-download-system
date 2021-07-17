const express = require("express");
const userController = require("./controller/userController");
const postController = require("./controller/postController");
const adminController = require("./controller/adminController");
// for test :
// const Test = require("./test")
// const db = require("./db");
// const postCollection = db.collection("posts");
// const User = require("./model/User");

const router = express.Router();

// ? GET REQUESTS :
router.get("/", userController.home);
router.get(
	"/user-logout",
	userController.mustBeLoggedIn,
	userController.logout
);
router.get("/post-new", userController.mustBeLoggedIn, postController.create);
router.get("/admin", adminController.home);
router.get(
	"/admin/logout",
	adminController.mustBeLoggedIn,
	adminController.logout
);
router.get(
	"/admin/start-download",
	adminController.mustBeLoggedIn,
	adminController.startQueue
);
router.get(
	"/admin/stop-download",
	adminController.mustBeLoggedIn,
	adminController.stop
);
router.get("/test", function (req, res) {                                                          //? TEST
    Test.func4();
    res.send('Finish')
});
router.get("/get-file", userController.mustBeLoggedIn, postController.download);
router.get(
	"/delete-post",
	adminController.mustBeLoggedIn,
	adminController.deletePost
);
router.get(
	"/change-profile",
	userController.mustBeLoggedIn,
	userController.changeProfilePage
);
router.get(
	"/dashboard",
	userController.mustBeLoggedIn,
	userController.dashboardPage
);

// ? POST REQUESTS :
router.post("/user-login", userController.login);
router.post("/user-signup", userController.signup);
router.post(
	"/post-new",
	userController.mustBeLoggedIn,
	postController.getUploader().single("poster"),
	postController.newRequest
);
router.post("/admin-login", adminController.login);
router.post(
	"/upload-profile",
	userController.mustBeLoggedIn,
	userController.getUploader().single("profile"),
	userController.uploadProfile
);
router.post('/search', userController.mustBeLoggedIn, postController.search)


module.exports = router;
