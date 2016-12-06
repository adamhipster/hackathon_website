
exports.root = (req, res) => {
		const viewContext = { };
		res.render('index', viewContext);
	};

