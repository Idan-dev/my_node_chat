const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	name: { type: String, default: 'Chat Message' },
	message: { type: String },
	sender: { type: String }
},
{ timestamps: true

});

module.exports = mongoose.model('Chat', chatSchema);