var mongoose = require('mongoose');
var path = require('path');

var db = mongoose.connect('mongodb://localhost::27017/fromscratch');

const Schema = mongoose.Schema;

var playerSchema = new Schema({
	name: {type: String, required: true},
	intelligence: {type: Number, required: false},
	looks: {type: Number, required: false},
	humour: {type: Number, required: false},
	wealth: {type: Number, required: false},
	kindness: {type: Number, required: false}
});

module.exports = mongoose.model('player', playerSchema);

