const index = require('../controllers/indexController');
const hackathon = require('../controllers/hackathonController');
const admin = require('../controllers/adminController');

module.exports = function(app, router){
	router.route('/').get(index.root);

	router.route('/hackathon').all(hackathon.root);
	router.route('/hackathon/add').post(hackathon.add);

	router.route('/admin/dashboard').get(admin.dashboard);

	app.use(router);
};