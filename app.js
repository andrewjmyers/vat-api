var express = require('express');
var app = express();
app.set('json spaces', 2);
var vatsim = require('./app/vatsim');
var js2xmlparser = require("js2xmlparser");

function dataUpdated() {
	console.log(new Date() + ": Data updated, updating again in 3 minutes");

	mins = 3 * 60 * 1000;
	setInterval(function() {
		updateData();
	}, mins);
}

function dataFailed() {
	updateData();
}

function updateData() {
	vatsim.updateVatsimData(dataUpdated, dataFailed);
}

vatsim.init(updateData);

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