var express = require('express'),
	logger = require('morgan'),
	app = express();

app.use('/bower_components', express.static(__dirname + '/static/bower_components'));
app.use('/ytvideo', express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/static/app'));
app.use(logger());

app.use('/yt', require('./routes/youtube').youtube);

app.listen(3000);