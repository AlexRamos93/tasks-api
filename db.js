import Mongo from 'mongodb';

var connMongoDB = function(){
	var db = new Mongo.Db(
		'Database Name', //Database Name
		new Mongo.Server(
			'localhost', //server address
			27017, //connection port
			{}
		),
		{}
	);

	return db;
}

module.exports = function(){
	return connMongoDB;
}