const index = require('../controllers/indexController');
const hackathon = require('../controllers/hackathonController');
const admin = require('../controllers/adminController');

module.exports = function(app, router){
	router.route('/').get(index.root);

	//user
	router.route('/addHackathon').post(hackathon.add);

	//admin
	router.route('/admin/dashboard').get(admin.dashboard);
	router.route('/admin/deleteHackathon/:id').get(admin.deleteHackathon);
	router.route('/admin/processHackathon/:id').get(admin.processHackathon);

	app.use(router);
};