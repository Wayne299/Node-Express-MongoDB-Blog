var express = require("express");
var router  = express.Router({mergeParams: true}); //findById 可以传入/:id
var Blog    = require("../models/blog");

// INDEX ROUTE
router.get("/",function(req, res){
	Blog.find({},function(err, blogs){  // blogs 将传入index.ejs
		if(err){
			console.log("error!");
		}else{
			res.render("index",{blogs:blogs, currentUser:req.user}); // 现在登陆的用户名
		}
	});
});

//CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
	// create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.create(req.body.blog, function(err, newBlog){ //bodyParser：req.body.blog 自动带着后面的[title] 
		if(err){
			res.render("new");
		}else{
			//redirect to the index
			res.redirect("/blogs");
		}
	});
});

//NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
	res.render("new");
});

//SHOW ROUTE
router.get("/:id",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});

//EDIT ROUTE (new + show)
router.get("/:id/edit",function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog})
		}
	});
});

//UPDATE ROUTE
router.put("/:id",function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updateBlog){ // id, newData, callback
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});  
});

//DELETE ROUTE
router.delete("/:id",function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

//middleware
function isLoggedIn(req, res, next){  //构造middleware
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;
