var express = require('express');
var app = express();
app.set('json spaces', 2);
var vatsim = require('./app/vatsim');
var js2xmlparser = require("js2xmlparser");
var path = require('path');

function dataUpdated() {
	console.log(new Date() + ": Data updated, updating again in 3 minutes");
}

function dataFailed() {
	updateData();
}

function updateData() {
	vatsim.updateVatsimData(dataUpdated, dataFailed);
}

app.use('/pages', express.static('views/pages'));
app.use('/vatapi/pages', express.static('views/pages'));
app.use('/static', express.static('public'));
app.use('/vatapi/static', express.static('public'));

vatsim.init(updateData);

mins = 3 * 60 * 1000;
var interval = setInterval(function() {
	updateData();
}, mins);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/clients/', function (req, res) {
	if(req.query.filter)
	{
		filter = req.query.filter.replace(" ", "").split(",");
		res.json(vatsim.getClients(filter));
	}
	else
	{
		res.json(vatsim.getClients());
	}
});

app.get('/raw/', function(req, res) {
	res.set('Content-Type', 'text/plain')
	res.send(vatsim.getRaw());
});

app.get('/general/', function(req, res) {
	res.json(vatsim.getGeneral());
});

app.get('/voiceServers/', function (req, res) {
	if(req.query.filter)
	{
		filter = req.query.filter.replace(" ", "").split(",");
		res.json(vatsim.getVoiceServers(filter));
	}
	else
	{
		res.json(vatsim.getVoiceServers());
	}
});

app.get('/servers/', function (req, res) {
	if(req.query.filter)
	{
		filter = req.query.filter.replace(" ", "").split(",");
		res.json(vatsim.getServers(filter));
	}
	else
	{
		res.json(vatsim.getServers());
	}
});

app.get('/prefiled/', function (req, res) {
	if(req.query.filter)
	{
		filter = req.query.filter.replace(" ", "").split(",");
		res.json(vatsim.getPrefiled(filter));
	}
	else
	{
		res.json(vatsim.getPrefiled());
	}
});

app.get('/clients/:id', function(req, res) {
	res.json(vatsim.getClient(req.params.id));
});

app.listen(3001, function() {
	console.log('API is up');
});