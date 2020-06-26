const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
	name: {type: String, default: 'Server Status'},
	usersOnline: { type: Array },
	usersOnlineNumber: { type: Number }
});

module.exports = mongoose.model('serverStatus', serverSchema);