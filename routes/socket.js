const express = require('express');
const router = express.Router();
const socketCtrl = require('../controllers/socket');


module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log(socket.id + ' is connected');
		console.log(socket.handshake.address);
		socketCtrl.newUser(io, socket);
		socketCtrl.sendChatMessage(io, socket);
		socketCtrl.typing(socket);
		socketCtrl.disconnectFromSocket(socket);
	});

	return router;
};