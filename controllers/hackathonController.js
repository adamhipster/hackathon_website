const model = require('../models/sequelize_db.js');

exports.add = (req, res) => {
	const b = req.body;
	const hackathon = {
		name: b.name,
		topic: b.topic,
		start_date: b.start_date,
		end_date: b.end_date,
		url: "sns.nl",
	};
	const location = {
		city: b.city,
		address_name: b.address_name,
		address_number: b.address_number,
	}
	model.addHackathon(hackathon, location)
	.then( (result) => {
		res.send(result);
	});
}

