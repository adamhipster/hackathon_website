const hackathon = require('../controllers/hackathonController');
const admin = require('../controllers/adminController');
const _ = require('underscore');
const ensureLoggedin = require('connect-ensure-login').ensureLoggedIn;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('../models/passport_users');
const bcrypt = require('bcrypt');

module.exports = function(app, router){

	//to do: put passport in its own seperate file
	passport.use(new Strategy(
		function(username, password, cb) {
			db.findByUsername(username, function(err, user) {
				if (err) { return cb(err); }
				if (!user) { return cb(null, false); }
				if (!bcrypt.compareSync(password, user.password) ) { return cb(null, false); }

				return cb(null, user);
			});
		}));

	passport.serializeUser(function(user, cb) {
		cb(null, user.id);
	});

	passport.deserializeUser(function(id, cb) {
		db.findById(id, function (err, user) {
			if (err) { return cb(err); }
			cb(null, user);
		});
	});

	app.use(passport.initialize());
	app.use(passport.session());
	//end passport


	//anon user
	router.route('/').get(hackathon.wortel);
	router.route('/addHackathon').post(hackathon.add);
	router.route('/admin').get(admin.root);

	//see: http://stackoverflow.com/questions/9285880/node-js-express-js-how-to-override-intercept-res-render-function
	app.use(function( req, res, next ) {
		if(req.url.includes('admin/')){
			const _render = res.render;
			res.render = function( view, options, fn ) {
				_.extend( options, {isAdmin: true} );
				_render.call( this, view, options, fn );
			}
		}
		next();
	});



	//admin views -- note: views are have under_scored style
	router.route('/admin/dashboard').get(ensureLoggedin('/admin'), admin.dashboard);
	router.route('/admin/approve_hackathons').get(ensureLoggedin('/admin'), admin.approveHackathons);
	router.route('/admin/live_hackathons').get(ensureLoggedin('/admin'), admin.liveHackathons);
	router.route('/admin/deleted_hackathons').get(ensureLoggedin('/admin'), admin.deletedHackathons);
	router.route('/admin/spammed_hackathons').get(ensureLoggedin('/admin'), admin.spammedHackathons);
	

	//admin functions -- note: functions have camelCase
	router.route('/admin/addHackathon').post(ensureLoggedin('/admin'), admin.addHackathon);
	router.route('/admin/deleteHackathon/:id').get(ensureLoggedin('/admin'), admin.deleteHackathon); 
	router.route('/admin/editHackathon/:id').get(ensureLoggedin('/admin'), admin.editHackathon); 
	router.route('/admin/processHackathon/:id').get(ensureLoggedin('/admin'), admin.processHackathon); 
	
	router.route('/admin/dashboard').post(
		passport.authenticate('local', { failureRedirect: '/admin' }),
		// ensureLoggedin('/admin'), 
		admin.dashboard	//redirects to /admin/dashboard
	);
	router.route('/admin/logout').get(ensureLoggedin('/admin'), admin.logout);

	
	app.use(router);
};