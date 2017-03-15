const Sequelize = require('sequelize')
const match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

//Possible values: "hackathonsapp" or "hackathonsapptest"


if (process.env.HEROKU_POSTGRESQL_AMBER_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_AMBER_URL, {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
    })
}
else {
	db = new Sequelize( process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
		dialect: 'postgres',
		logging: (process.env.DB_NAME=="hackathonsapptest"?false:true)
	});
}

//console.log("db name");
//console.log(process.env.DB_NAME);
//console.log(db.config.database);

db.authenticate().catch(x => console.log(x)).then(x => console.log('>> database connection established'));

const globalOptions = 	{paranoid: true}

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
globalOptions);

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
},
globalOptions);

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
globalOptions);

//RELATIONS
Hackathon.hasOne(Status);
Hackathon.hasOne(Location);


//PRODUCTION DB START
db.sync()
.catch( (error) => console.log(error) );

//DEVELOPMENT DB START
// db.sync({force:true})
// .catch( (error) => console.log(error) );

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

addHackathon: (reqBody, isSpam, isUnprocessed) => {
	const value = {
		name: reqBody.name,
		topic: reqBody.topic,
		start_date: reqBody.start_date,
		end_date: reqBody.end_date,
		url: reqBody.url,
		location: {
			city: reqBody.city,
			address_name: reqBody.address_name,
			address_number: reqBody.address_number,
		},
		status: {
			spam: isSpam,					//null for anon users, false for admin
			unprocessed: isUnprocessed, //true for anon users, false for admin
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

editHackathonById: (id, reqBody) => {
	return Hackathon.findOne({ 
		where: {
			id: id,
		}
	})
	.then( (hackathon) =>{
		const value = {
			name: reqBody.name,
			topic: reqBody.topic,
			start_date: reqBody.start_date,
			end_date: reqBody.end_date,
			url: reqBody.url,
			location: {
				city: reqBody.city,
				address_name: reqBody.address_name,
				address_number: reqBody.address_number,
			},
			status: {
				spam: reqBody.isSpam,				//null for anon users, false for admin
				unprocessed: reqBody.isUnprocessed, //true for anon users, false for admin
			}
		};
		return hackathon.update(value)
		.catch( (error) => {
			console.log(error);
			return error;
		});
	})
},

setSpamAttrForHackathonById: (id, isRealEvent) => {
	let isSpam;
	if(isRealEvent === "true"){
		isSpam = false;
	}
	else if (isRealEvent === "false"){
		isSpam = true;
	}
	else{
		console.log("Captured else statement of setSpamAttrForHackathonById");
	}
	return Hackathon.findOne({
		where: {
			id: id,
		},
		include: [{all: true}]
	})
	.then( (hackathon) => {
		return hackathon.status.update({
			unprocessed: false,
			spam: isSpam,
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
},

getRealHackathons: () => {
	return Hackathon.findAll({
		order: '"start_date" ASC',
		include: [{
			model: Location,
		},
		{
			model: Status,
			where: {unprocessed: false, spam: false},
		}],
	})
	.then( (hackathons) => {
		return hackathons;
	});
},

getDeletedHackathons: () => {
	return Hackathon.findAll({
		paranoid: false, 
		where: {deletedAt: {ne: null}},
		include: [{all: true}],
	})
	.then( (hackathons) => {
		return hackathons;
	});
},

getSpammedHackathons: () => {
	return Hackathon.findAll({
		include: [{
			model: Location,
		},
		{
			model: Status,
			where: {spam: true},
		}],
	})
	.then( (hackathons) =>{
		return hackathons;
	});
},




}; //end of module.exports
