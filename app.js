var bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose = require("mongoose"),
	// ==============user setting=============
	LocalStrategy = require("passport-local"),
	passport = require("passport"),
	User = require("./models/user"), // 导入User model
	// =======================================
	Blog = require("./models/blog"),
	express = require("express"),
	app = express();

//requiring routes
var blogsRoutes = require("./routes/blogs"),
	indexRoutes = require("./routes/index");

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
app.set("view engine", "ejs");
app.use(express.static("public")); // ??
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); // 防止用户输入script
app.use(methodOverride("_method"));

// PASSPORT CONFIGUARTION
app.use(
	require("express-session")({
		secret: "this is the secret",
		resave: false, // 默认
		saveUninitialized: false // 默认
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // middleware 来自 passportLocalMongoose的method
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//RESTFUL ROUTES
// NAME      PAHT           HTTP VERB     MOOGOOSE METHOD
// index 	/blogs 		      get 			Blog.find()
// new 	    /blogs/new 	      get 			N/A
// create   /blogs	          get 			Blogs.create()
// show     /blogs/:id        get 			Blog.findById()
// edit     /blogs/:id/edit	  get 			Blog.findById()
// update   /blogs/:id        put 			Blog.findByIdAndUpdate()
// destroy  /blogs/:id        delete 		Blog.findByIdAndRemove()

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
}); //全局赋值 currentUser = req.user (id和username)

app.use(indexRoutes);
app.use("/blogs", blogsRoutes); //前面自动填 /blogs

app.listen(process.env.PORT || 3000, function() {
	console.log("Server Has Started!");
});
