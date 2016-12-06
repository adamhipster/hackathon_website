const model = require('../models/sequelize_db.js');


exports.dashboard = (req, res) => {
	model.getUnprocessedHackathons().
	then( (hackathons) => {
		res.send(hackathons);
	});
};