var clients = [];
var rawClients = [];
var general = {};
var voiceServers = [];
var rawVoiceServers = [];
var servers = [];
var rawServers = [];
var prefiledFPs = [];
var rawPrefiledFPs = [];

var callsignToClient = {};
var dataUrls = [];

var raw = "";

var fs = require('fs');
var request = require('request');


function parseClients(c)
{
	clients = [];
	rawClients = [];
	
	for(line in c)
	{
		client = {};
		things = c[line].split(":");
		client["callsign"] = things[0];
		client["cid"] = things[1];
		client["name"] = things[2];
		client["clienttype"] = things[3];
		client["frequency"] = things[4];
		client["latitude"] = things[5];
		client["longitude"] = things[6];
		client["altitude"] = things[7];
		client["groundspeed"] = things[8];
		client["planned_aircraft"] = things[9];
		client["planned_tascruse"] = things[10];
		client["planned_depairport"] = things[11];
		client["planned_altitude"] = things[12];
		client["planned_destairport"] = things[13];
		client["server"] = things[14];
		client["protrevision"] = things[15];
		client["rating"] = things[16];
		client["transponder"] = things[17];
		client["facilitytype"] = things[18];
		client["visualrange"] = things[19];
		client["planned_revision"] = things[20];
		client["planned_flighttype"] = things[21];
		client["planed_deptime"] = things[22];
		client["planned_actdeptime"] = things[23];
		client["planned_hrsenroute"] = things[24];
		client["planed_minenroute"] = things[25];
		client["planned_hrsfuel"] = things[26];
		client["planned_minfuel"] = things[27];
		client["planned_altairport"] = things[28];
		client["planned_remarks"] = things[29];
		client["planned_route"] = things[30];
		client["planned_depairport_lat"] = things[31];
		client["planned_depairport_lon"] = things[32];
		client["planned_destairport_lat"] = things[33];
		client["planned_destairport_lon"] = things[34];
		client["atis_message"] = things[35];
		client["time_last_atis_received"] = things[36];
		client["time_logon"] = things[37];
		client["heading"] = things[38];
		client["QNH_iHg"] = things[39];
		client["QNH_Mb"] = things[40];

		rawClient = [];

		for(i = 0; i <= 40; i++)
		{
			rawClient.push(things[i]);
		}

		rawClients.push(rawClient);

		clients.push(client);
		callsignToClient[client.callsign] = client;
	}
}

function parseGeneral(data)
{
	general = {};
	for(line in data)
	{
		l = data[line];
		general[l.split("=")[0]] = l.split("=")[1];
	}
}

function parseServers(data)
{
	servers = [];
	rawServers = [];

	for(line in data)
	{
		server = {};
		things = data[line].split(":");

		l = data[line].replace(" ", "");
		server["ident"] = things[0];
		server["hostname"] = things[1];
		server["location"] = things[2];
		server["name"] = things[3];
		server["clientsConnectionAllowed"] = things[4];

		rawServer = [];

		for(i = 0; i <= 4; i++)
		{
			rawServer.push(things[i]);
		}

		rawServers.push(rawServer);

		servers.push(server);
	}
}

function parsePrefile(data)
{
	prefiledFPs = [];
	rawPrefiledFPs = [];

	for(line in data)
	{
		client = {};
		things = data[line].split(":");
		client["callsign"] = things[0];
		client["cid"] = things[1];
		client["name"] = things[2];
		client["clienttype"] = things[3];
		client["frequency"] = things[4];
		client["latitude"] = things[5];
		client["longitude"] = things[6];
		client["altitude"] = things[7];
		client["groundspeed"] = things[8];
		client["planned_aircraft"] = things[9];
		client["planned_tascruse"] = things[10];
		client["planned_depairport"] = things[11];
		client["planned_altitude"] = things[12];
		client["planned_destairport"] = things[13];
		client["server"] = things[14];
		client["protrevision"] = things[15];
		client["rating"] = things[16];
		client["transponder"] = things[17];
		client["facilitytype"] = things[18];
		client["visualrange"] = things[19];
		client["planned_revision"] = things[20];
		client["planned_flighttype"] = things[21];
		client["planed_deptime"] = things[22];
		client["planned_actdeptime"] = things[23];
		client["planned_hrsenroute"] = things[24];
		client["planed_minenroute"] = things[25];
		client["planned_hrsfuel"] = things[26];
		client["planned_minfuel"] = things[27];
		client["planned_altairport"] = things[28];
		client["planned_remarks"] = things[29];
		client["planned_route"] = things[30];
		client["planned_depairport_lat"] = things[31];
		client["planned_depairport_lon"] = things[32];
		client["planned_destairport_lat"] = things[33];
		client["planned_destairport_lon"] = things[34];
		client["atis_message"] = things[35];
		client["time_last_atis_received"] = things[36];
		client["time_logon"] = things[37];
		client["heading"] = things[38];
		client["QNH_iHg"] = things[39];
		client["QNH_Mb"] = things[40];

		prefiledFPs.push(client);

		rawClient = [];

		for(i = 0; i <= things.length; i++)
		{
			rawClient.push(things[i]);
		}

		rawPrefiledFPs.push(rawClient);
	}
}

function parseVoice(data)
{
	voiceServers = [];
	rawVoiceServers = [];

	for(line in data)
	{
		l = data[line];
		things = l.split(":");
		voice = {};
		voice["address"] = things[0];
		voice["location"] = things[1];
		voice["name"] = things[2];
		voice["clients_allowed"] = things[3];
		voice["type"] = things[4];
		voiceServers.push(voice);

		rawVoice = [];

		for(i = 0; i <= 4; i++)
		{
			rawVoice.push(things[i]);
		}

		rawVoiceServers.push(rawVoice);
	}
}

function filterVatsim(filter, a)
{
	n = [];

	for(c in a)
	{
		client = a[c];
		n.push(filterSingle(filter, client));
	}

	return n;
}

function filterSingle(filter, c)
{
	nc = {};

	for(f in filter)
	{
		fi = filter[f];

		if(c[fi])
		{
			nc[fi] = c[fi];
		}
	}

	return nc;
}

function buildRaw()
{
	raw = "";
	raw = raw + "!GENERAL:\n";

	for(key in general)
	{
		raw = raw + key + "=" + general[key] + "\n";
	}

	raw = raw + ";\n";
	raw = raw + ";\n";
	raw = raw + "!VOICE SERVERS:\n";

	for(v in rawVoiceServers)
	{
		s = rawVoiceServers[v];
		raw = raw + s.join(":") + ":\n";
	}

	raw = raw + ";\n";
	raw = raw + ";\n";
	raw = raw + "!CLIENTS\n";

	for(v in rawClients)
	{
		s = rawClients[v];
		raw = raw + s.join(":") + "\n";
	}

	raw = raw + ";\n";
	raw = raw + ";\n";
	raw = raw + "!SERVERS:\n";

	for(v in rawServers)
	{
		s = rawServers[v];
		raw = raw + s.join(":") + "\n";
	}

	raw = raw + ";\n";
	raw = raw + ";\n";
	raw = raw + "!PREFILE:\n";

	for(v in rawPrefiledFPs)
	{
		s = rawPrefiledFPs[v];
		raw = raw + s.join(":") + "\n";
	}

	raw = raw + ";\n";
	raw = raw + ";   END";
}

module.exports = {
	getClient: function(id) {
		if(callsignToClient[id])
		{
			return callsignToClient[id];
		}
		else
		{
			return {'error': 'No client found with ID ' + id};
		}
	},
	getClients: function(filter) {
		if(filter)
		{
			return filterVatsim(filter, clients);
		}

		return clients;
	},
	getVoiceServers: function(filter) {
		if(filter)
		{
			return filterVatsim(filter, voiceServers);
		}

		return voiceServers;
	},
	getGeneral: function() {
		return general;
	},
	getPrefiled: function(filter) {
		if(filter)
		{
			return filterVatsim(filter, prefiledFPs);
		}

		return prefiledFPs;
	},
	getServers: function(filter) {
		if(filter)
		{
			return filterVatsim(filter, servers);
		}

		return servers;
	},
	getCallsignsToClients: function() {
		return callsignToClient;
	},
	init: function(callback) {
		fs.readFile('app/status.txt', 'utf8', function(err, contents) {
			if(err)
			{
				console.log(err);
				return;
			}
			var lines = contents.split("\n");
			for(line in lines)
			{
				l = lines[line];
				
				if(l.startsWith("url0"))
				{
					dataUrls.push(l.split("=")[1]);
					console.log(l.split("=")[1]);
				}
			}

			callback();
		});
	},
	getRaw: function() {
		return raw;
	},
	updateVatsimData: function(dataUpdated, dataFailed)
	{
		if(dataUrls.length > 0)
		{
			url = dataUrls[Math.floor((Math.random() * dataUrls.length) + 1)];

			request({
				url: url,
				json: false,
				timeout: 2000
			}, function(error, response, body) {
				if(!error && response.statusCode === 200)
				{
					lineNumber = 0;

					lines = response.body.split("\n");
					inSection = false;
					currentSection = "";
					data = [];

					if(lines.length < 1 || lines[4].includes("DOWNLOAD ALLOTMENT EXCEEDED"))
					{
						dataFailed();
						return;
					}

					console.log(new Date() + ": Data collection started");

					for(line in lines)
					{
						l = lines[line];

						if(l === ";   END")
						{
							if(wasInSection)
							{
								if(currentSection === "GENERAL")
								{
									parseGeneral(data);
									data = [];
								}
								else if (currentSection === "CLIENTS")
								{
									parseClients(data);
									data = [];
								}
								else if (currentSection === "PREFILE")
								{
									parsePrefile(data);
									data = [];
								}
								else if (currentSection === "SERVERS")
								{
									parseServers(data);
									data = [];
								}
								else if (currentSection === "VOICE SERVERS")
								{
									parseVoice(data);
									data = [];
								}
							}

							buildRaw();
							dataUpdated();
							return;
						}
						else if(l.startsWith(";"))
						{

						}
						else if(inSection && !l.startsWith("!"))
						{
							data.push(l);
						}
						else if(l.startsWith("!"))
						{
							wasInSection = inSection;

							inSection = true;
							newCurrentSection = l.replace("!", "").replace(";", "").replace(":", "");
							
							if(wasInSection)
							{
								if(currentSection === "GENERAL")
								{
									parseGeneral(data);
									data = [];
								}
								else if (currentSection === "CLIENTS")
								{
									parseClients(data);
									data = [];
								}
								else if (currentSection === "PREFILE")
								{
									parsePrefile(data);
									data = [];
								}
								else if (currentSection === "SERVERS")
								{
									parseServers(data);
									data = [];
								}
								else if (currentSection === "VOICE SERVERS")
								{
									parseVoice(data);
									data = [];
								}
							}

							currentSection = newCurrentSection;
						}
					}
				}
				else
				{
					dataFailed();
				}
			});
		}
	}
}