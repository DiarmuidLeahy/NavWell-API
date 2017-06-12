/*
Environment configuration
*/

var configuration = 
{
	develop:
	{
		connectionString:'mongodb://localhost:27017/navwell-dev',	//This instance no longer exists so I've set currentEnvironment to production on line 32 below
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
		//connectionString:'mongodb://beta-user:1q2w3e4r@ds027809.mongolab.com:27809/coes-beta',
		connectionString:'mongodb://navwelldb2:NavW3lldb@ds015690.mlab.com:15690/navwell',
		port:4242,
		//urlClient:'http://www.coescomunicacion.com:7000/metrix/',
		enableCORS:true,	//Cross origin requests
		loggly_host: 'logs-01.loggly.com',
		loggly_path: '/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
		files_path: '/public/files',
		urlServer: 'http://localhost:4242/'
	}
};

var currentEnvironment = 'production';
//var currentEnvironment = 'develop';

exports.getSetting = function(pSettingName) {
	return configuration[currentEnvironment][pSettingName];
};

exports.getEnvironment = function() {
	return currentEnvironment;
}