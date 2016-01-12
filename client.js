var request = require("request"),
	fs = require("fs");

require('dotenv').config({path: __dirname+'/.env'});

var file = fs.readFileSync("example.pdf");

fs.writeFileSync("example1.pdf",file,'binary');

//POST the file to the server
var options = { uri : "http://localhost:"+process.env.API_PORT+'/file', method : 'POST', headers: { 'Content-Type': 'text/plain', 'Content-Length': file.length }, body: file };
requestPromise(options).then( function (result) {

	result = JSON.parse(result);
	return result;

}).then( function (result) {

	//GET the file from the server
	options = { uri : "http://localhost:"+process.env.API_PORT+'/file/'+result._id, encoding: 'binary',method : 'GET' };
	return requestPromise(options);

}).then( function (result) {

	//Write the contents to a file
	console.log(result);
	fs.writeFileSync("example2.pdf",result,'binary');

}).catch(function (error) {

	console.log(error);

});

function requestPromise(options) {
	return new Promise( function (resolve,reject) {
		request(options, function (error, response, result) {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	}).catch( function (error) {
		console.log("Request failed");
		console.log(error);
	});
}