const model = require('../models/sequelize_db.js');
const moment = require('moment');

exports.root = (req, res) => {
	model.getRealHackathons()
	.then( (hackathons) => {
		for (let hackathon of hackathons){
			let startDate = moment(hackathon.start_date).locale('nl').format('D');
			let startDay = moment(hackathon.start_date).locale('nl').format('dd');
			let startMonth = moment(hackathon.start_date).locale('nl').format('MMMM');
			let startYear = moment(hackathon.start_date).locale('nl').format('YY');
			let endDate = moment(hackathon.end_date).locale('nl').format('D');
			let endDay = moment(hackathon.end_date).locale('nl').format('dd');
			let endMonth = moment(hackathon.end_date).locale('nl').format('MMMM');
			let endYear = moment(hackathon.end_date).locale('nl').format('YY');
			
			let monthRenderString = startMonth;
			let dayRenderString = startDay + ' - ' + endDay;
			let dateRenderString = startDate + ' - ' + endDate;
			
			if (startMonth!==endMonth){
				startMonth = moment(hackathon.start_date).locale('nl').format('MMM');
				endMonth = moment(hackathon.end_date).locale('nl').format('MMM');
				monthRenderString = startMonth + ' - ' + endMonth;
			}
			if (startYear!==endYear){
				monthRenderString = startMonth + " '"+startYear+ ' - ' + endMonth +" '"+endYear;
			}

			hackathon.dateRenderString = dateRenderString;
			hackathon.dayRenderString = dayRenderString;
			hackathon.monthRenderString = monthRenderString;
		}

		const serverMessage = "Dit is een bericht van de server.";
	
		const viewContext = {
			hackathons: hackathons, 
			serverMessage: serverMessage,
		};	
		res.render('index', viewContext);
	});
};