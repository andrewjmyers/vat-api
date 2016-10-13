var express = require('express');
var app = express();
var vatsim = require('./app/vatsim');
var js2xmlparser = require("js2xmlparser");

function updateData() {
	vatsim.updateVatsimData();
}

vatsim.init(updateData);

app.get('/clients/', function (req, res) {
	if(req.query.type)
	{
		if(req.query.type == 1)
		{
			res.json(vatsim.getCallsignsToClients());
			return;
		}
	}
	res.json(vatsim.getClients());
});

app.get('/clients/:id', function (req, res) {
	res.json(vatsim.getClient(req.params.id));
});

app.listen(3001, function() {
	console.log('API is up');
});