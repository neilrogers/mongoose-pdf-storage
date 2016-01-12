var fs = require('fs'),
    mongoose = require('mongoose'),
    Grid = require('gridfs-stream');

module.exports.get = function (req, res){

	Grid.mongo = mongoose.mongo;
	var gfs = new Grid(mongoose.connection.db);

	var contents = "";

		
	gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) },function (err, file) {
 		
 		//console.log(file);
				
		var readstream = gfs.createReadStream({
			_id: mongoose.Types.ObjectId(req.params.id)
		});

	    var writeStream = fs.createWriteStream('FileOut.pdf');
	    readstream.pipe(writeStream);
		readstream.pipe(res);
	    
 
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
	});

}

module.exports.post = function (req, res) {
	
	if (req.rawBody == "") {
		return res.send({error:"File content is missing."},500);
	}

	console.log(req.rawBody);
	console.log(req.body);

	var fileContents = req.body;
	fs.writeFileSync("FileIn.pdf",fileContents,'binary');

	return new Promise( function (resolve,reject) {

		Grid.mongo = mongoose.mongo;
		var gfs = new Grid(mongoose.connection.db);

		var writeStream = gfs.createWriteStream({
			filename: "File.pdf",
			mode: 'w'
		});

		writeStream.write(fileContents);
		writeStream.end();

		writeStream.on('close', function(file) {
			resolve(file);
		});

	}).then( function (file) {
		console.log("SUCCESS: File saved ID is "+file._id);
		res.send(file);
	}).catch( function (error) {
		console.log("FAILED: File failed to save");
		console.log(error);
		res.send({'error': 'File failed to save','message': error},500);
	});

}
