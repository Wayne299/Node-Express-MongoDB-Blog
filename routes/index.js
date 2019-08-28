var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//root route
router.get("/",function(req, res){
	res.redirect("/blogs");
});

// ==========
// AUTH ROUTES
// ==========

//show register form
router.get("/register",function(req, res){
	res.render("register");
});

//handle sigh up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){  //register 是plugin里的方法 (newUser, passport, callback)
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){ //"local" 是种形式 "twitter" etc.
			res.redirect("/blogs");
		})
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handle login logic 
router.post("/login", passport.authenticate("local",{  //middleware 
	successRedirect:"/blogs",
	failureRedirect: "/login"
}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();  // 来自插件
	res.redirect("/blogs");
});


//middleware
function isLoggedIn(req, res, next){  //构造middleware
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;
