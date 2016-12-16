const hackathon = require('../controllers/hackathonController');
const admin = require('../controllers/adminController');
const _ = require('underscore');
const ensureLoggedin = require('connect-ensure-login').ensureLoggedIn;
const passport = require('passport');

module.exports = function(app, router){

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
	router.route('/admin/editHackathon/:id').post(ensureLoggedin('/admin'), admin.editHackathon); 
	router.route('/admin/processHackathon/:id').get(ensureLoggedin('/admin'), admin.processHackathon); 
	
	router.route('/admin/dashboard').post(
		passport.authenticate('local', { failureRedirect: '/admin' }),
		admin.dashboard	//redirects to /admin/dashboard
	);
	router.route('/admin/logout').get(ensureLoggedin('/admin'), admin.logout);

	
	app.use(router);
};