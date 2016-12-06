const index = require('../controllers/indexController');
const hackathon = require('../controllers/hackathonController');
const admin = require('../controllers/adminController');
const ensureLoggedin = require('connect-ensure-login').ensureLoggedIn;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('../models/passport_users');

module.exports = function(app, router){
	passport.use(new Strategy(
		function(username, password, cb) {
			console.log("passport.use was called");
			db.findByUsername(username, function(err, user) {
				if (err) { return cb(err); }
				if (!user) { return cb(null, false); }
				if (user.password != password) { return cb(null, false); }
				return cb(null, user);
			});
		}));

	passport.serializeUser(function(user, cb) {
		console.log("passport.serializeUser was called");
		cb(null, user.id);
	});

	passport.deserializeUser(function(id, cb) {
		console.log("passport.deserializeUser was called");
		db.findById(id, function (err, user) {
			if (err) { return cb(err); }
			cb(null, user);
		});
	});



	app.use(passport.initialize());
	app.use(passport.session());

	router.route('/').get(index.root);

	//anon user
	router.route('/addHackathon').post(hackathon.add);

	//admin views
	router.route('/admin').get(admin.root);
	router.route('/admin/dashboard').get(ensureLoggedin('/admin'), admin.dashboard);

	//admin functions
	router.route('/admin/deleteHackathon/:id').get(ensureLoggedin('/admin'), admin.deleteHackathon);
	router.route('/admin/processHackathon/:id').get(ensureLoggedin('/admin'), admin.processHackathon);
	router.route('/admin/login').post(
		passport.authenticate('local', { failureRedirect: '/admin' }), 
		admin.authenticated	//redirects to /admin/dashboard
	);
	router.route('/admin/logout').get(ensureLoggedin('/admin'), admin.logout);

	
	app.use(router);
};