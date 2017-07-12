let mongoose = require('mongoose');
mongoose.connect('mongodb://user1:1029@ds139801.mlab.com:39801/terry-database');

let docSchema = mongoose.Schema({

	id:Number,
	name:String,
	author:String,
	content:String,
	uid:String
});

let docModel = mongoose.model('docs', docSchema);

module.exports = docModel;
