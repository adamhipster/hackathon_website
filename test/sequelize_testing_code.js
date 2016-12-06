//This testing code is mainly meant for the node console

const Sequelize = require('sequelize')
const db = new Sequelize('hackathonsapp', 'melvin', '', {
	dialect: 'postgres',
});

db.authenticate().catch(x => console.log(x)).then(x => console.log('>> database connection established'));

//DEFINITIONS
const Hackathon = db.define('hackathon', {
	//Minimum: name, location (foreign key), start date, url
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	topic: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	start_date: {
		type: Sequelize.DATEONLY,
		allowNull: false,
	},
	// start_time: {
	// 	type: Sequelize.TIME,
	// 	allowNull: true,
	// },
	end_date: {
		type: Sequelize.DATEONLY,
		allowNull: true,
	},
	// end_time: {
	// 	type: Sequelize.TIME,
	// 	allowNull: true,
	// },
	url: {
		type: Sequelize.STRING,
		allowNull: false,
	},
},
{
	paranoid: true
});

const Location = db.define('location', {
	// country: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false,
	// },
	city: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	address_name: {
		type: Sequelize.STRING,
		allowNull: true,	
	},
	address_number: {
		type: Sequelize.INTEGER,
		allowNull: true,	
	},
})

const Status = db.define('status', {
	
	//For when I feel like I want to train a spam filter
	spam: {
		type: Sequelize.BOOLEAN,
		allowNull: true,
	},

	//for web dashboard
	unprocessed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
	},
},
{
	paranoid: true
});

//RELATIONS
Hackathon.hasOne(Status);
Hackathon.hasOne(Location);

//TEST DATA
db.sync()

//Want to: return the location in the .then() part of the promise
//It works!
function addLocationTest (){
return Location.create({
		city: "Amsterdam",
		address_name: "Bruinvisstraat",
		address_number: "127",
	})
	.then( (location) => {
		console.log("Location id: ");
		console.log(location.id);
		console.log("City: ");
		console.log(location.city);
	});
}

//Note: doesn't work outside of function
	// Location.create({
	// 	city: "Amsterdam",
	// 	address_name: "Bruinvisstraat",
	// 	address_number: "127",
	// })
	// .then( (x) => {
	// 	console.log(x.city);
	// });

//Does work with variable
let p = Location.create({
		city: "Amsterdam",
		address_name: "Bruinvisstraat",
		address_number: "127",
	})
	p.then( (x) => {
		console.log(x.city);
	});

//Works! Possible with [] or without for foreign keys (e.g. location: [{args...}] or location: {args...})
//SELECT * FROM hackathons, locations WHERE hackathons.id = locations."hackathonId";
function addHackathon () {
	const element = {
		name: "SNS Fackathon!!!",
		topic: "Fintech",
		start_date: new Date(),
		end_date: new Date(2016, 11, 30),
		url: "sns.nl",
		location: {
			city: "Amsterdam",
			address_name: "Bruinvisstraat",
			address_number: 255,
		},
	};
	const opts = {
		include: [Location]
	};
	return Hackathon.create(element, opts);
}

//adding the Status element
//WORKS!
function addHackathon () {
	const element = {
		name: "SNS Fackathon!!!",
		topic: "Fintech",
		start_date: new Date(),
		end_date: new Date(2016, 11, 30),
		url: "sns.nl",
		location: {
			city: "Amsterdam",
			address_name: "Bruinvisstraat",
			address_number: 255,
		},
		status: {
			spam: null,
			unprocessed: true,	
		}
	};
	const opts = {
		include: [Location, Status]
	};
	return Hackathon.create(element, opts);
}

//Keeping it here. Learning lesson: Unhandled rejection SequelizeDatabaseError: column hackathon.Status does not exist
//Same goes for "status" and I thought the includes allowed us to query for additional fields
function getUnprocessedHackathons() {
	return Hackathon.findAll({
		include: [{
			model: Location,
			where: {city: "Amsterda"},
		}, {
			model: Status,
			where: {unprocessed: true},
		}],
	})
	.then( (hackathons) => {
		console.log("hackathons");
		console.log(hackathons);
		return hackathons;
	});
}

getUnprocessedHackathons()