const express = require('express');
const app     = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');

//routers
require('./config/allRoutes')(app, express.Router());

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});