/*
Environment configuration
*/


//This retrieves all private IPv4 addresses and is only helpful when working locally
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses);

var configuration = 
{
	develop:
	{
		//connectionString:'mongodb://beta-user:1q2w3e4r@ds027809.mongolab.com:27809/coes-beta',	//Old DB used for beta testing
		//connectionString:'mongodb://192.168.1.113:27017/navwell-dev',								//Area51 IP address
		//connectionString:'mongodb://'+addresses[0]+'/navwell-dev',								//Gets first from a list of local IP addresses
		connectionString:'mongodb://127.0.0.1:27017/navwell-dev',									//Localhost
		port:4242,
		urlClient:'http://127.0.0.1:9000/#/',
		enableCORS:true,
		loggly_host: 'logs-01.loggly.com',
		loggly_path: '/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
		files_path: '/public/files',
		urlServer: 'http://localhost:4242/'
	},
	production:
	{
		connectionString:'mongodb://navwelldb2:NavW3lldb@ds015690.mlab.com:15690/navwell',	//Live DB hosted on mLab
		port:4242,
		urlClient:'http://www.coescomunicacion.com:7000/metrix/',
		enableCORS:true,	//Cross origin requests
		loggly_host: 'logs-01.loggly.com',
		loggly_path: '/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
		files_path: '/public/files',
		urlServer: 'http://localhost:4242/'
	}
};

//var currentEnvironment = 'production';
var currentEnvironment = 'develop';

exports.getSetting = function(pSettingName) {
	return configuration[currentEnvironment][pSettingName];
};

exports.setSetting = function(pSettingName, newValue) {
	configuration[currentEnvironment][pSettingName] = newValue;
};

exports.getEnvironment = function() {
	return currentEnvironment;
}
