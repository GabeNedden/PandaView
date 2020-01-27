var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Landing Page
router.get("/", function(req, res){
	res.render("landing");
});

//AUTH ROUTES
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, req, function(){
			req.flash("success", "Welcome, " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});
//handles login logic
router.post("/login", function (req, res, next) {
	passport.authenticate("local",
	  {
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true,
		successFlash: "Welcome, " + req.body.username + "!"
	  })(req, res);
  });

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;