const Sequelize = require('sequelize')

//Possible values: "hackathonsapp" or "hackathonsapptest"
const db = new Sequelize( process.env.DB_NAME || "hackathonsapp", 'melvin', '', {
	dialect: 'postgres',
	logging: (process.env.DB_NAME=="hackathonsapptest"?false:true)
});

console.log("db name");
console.log(process.env.DB_NAME);
console.log(db.config.database);

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
});

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
});

//RELATIONS
Hackathon.hasOne(Status);
Hackathon.hasOne(Location);

//DEVELOPMENT DB START
// db.sync({force:true})
// .then( (x) => {
// 	return Promise.all([
// 			User.create({
// 				firstname:'Melvin',
// 				lastname:'Roest',
// 				username:'mella',
// 				password: '$2a$10$Ggg0Usp6T2a.lJMbTWrLEupiZUJBjH4uQy.G1tpzxu9gX9EtnJyUm',
// 				posts: [
// 					{title:'Lifehack', body: 'The best lifehack is hugging people.' },
// 					{title:'Awesome', body: 'Just Splendid!'},
// 				]
// 			}, {
// 				include: [ Post ]
// 			}),
// 		])
// 	})
// .catch( (error) => console.log(error) );

//PRODUCTION DB START
db.sync()
.catch( (error) => console.log(error) );

//EXPOSE PUBLICLY
module.exports = {db: db, Hackathon: Hackathon, Location: Location, Status: Status,

getAllHackathons: () => {
	return Hackathon.findAll({
		include: [{all: true}],
	})
	.then( (hackathons) => {
		return hackathons;
	});
},

getHackathonById: (id) => {
	return Hackathon.findById(id, {
		include: [{all: true}],
	})
	.then( (hackathon) => {
		return hackathon;
	});
},

addHackathon: (hackathon, location) => {
	const value = {
		name: hackathon.name,
		topic: hackathon.topic,
		start_date: hackathon.start_date,
		end_date: hackathon.end_date,
		url: hackathon.url,
		location: {
			city: location.city,
			address_name: location.address_name,
			address_number: location.address_number,
		},
		status: {
			spam: null,
			unprocessed: true,
		}
	};
	const opts = {
		include: [Location, Status]
	};
	return Hackathon.create(value, opts)	
	.catch( (error) => {
		console.log(error);
		return error;
	});
},

deleteHackathonById: (id) => {
	return Hackathon.destroy({
		where: {
			id: id,
		},
		include: [{all: true}]
	});
},

setSpamAttrForHackathonById: (id, isRealEvent) => {
	return Hackathon.findOne({
		where: {
			id: id,
		},
		include: [{all: true}]
	})
	.then( (hackathon) => {
		return hackathon.status.update({
			unprocessed: false,
			spam: !isRealEvent,
		});
	});
},

getUnprocessedHackathons: () => {
	return Hackathon.findAll({
		include: [{
			model: Location,
		},
		{
			model: Status,
			where: {unprocessed: true},
		}],
	})
	.then( (hackathons) => {
		return hackathons;
	});
}

};
