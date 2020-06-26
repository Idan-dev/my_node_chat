const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const serverStatus = require('../models/serverStatus')
const User = require('../models/User');

exports.disconnectFromSocket = (socket) => {
	socket.on('disconnect', () => {

		// Sends a message to everyone else when one chatter disconnects
		socket.broadcast.to('room 1').emit('disconnection', (socket.pseudo));

		// Check the Server Status in the database
		serverStatus.find({ name: 'Server Status' })
			.then(result => {
				let oldArray = [];

				for (let i = 0; i < result[0].usersOnline.length; i++) {
					oldArray.push(result[0].usersOnline[i]);
				}

				if (oldArray.indexOf(socket.pseudo) != -1) {
					oldArray.splice(oldArray.indexOf(socket.pseudo), 1);
				}

				let numberCount = oldArray.length;
				console.log(numberCount);

				// Update the Server Status in the database deleting the user's pseudo
				serverStatus.updateOne({ name: 'Server Status'}, { usersOnline: oldArray, usersOnlineNumber: numberCount })
					.then(newresult => {
						console.log(newresult)

						// Check the Server Status again to see if there is someone still connected to the chat
						serverStatus.find({ name: 'Server Status' })
						.then(otherResult => {
							let onlineChatter = otherResult[0].usersOnlineNumber;
							console.log(onlineChatter);

							User.updateOne( { username: socket.pseudo }, { username: ''})
								.then(success => console.log(success))
								.catch(error => console.log(error));

							// If not, delete all chat messages from the database
							if (onlineChatter === 0) {
								Chat.deleteMany({ name: 'Chat Message' })
								.then(newresult => console.log(newresult))
								.catch(error => console.log(error));
							}
						})
						.catch(error => console.log(error));
					})
					.catch(error => console.log(error));
				})
			.catch(error => console.log(error));
	});
};
		
	

exports.typing = (socket) => {
	socket.on('typing', () => {
		socket.broadcast.to('room 1').emit('typing', socket.pseudo + ' is typing');
	});
};

exports.sendChatMessage = (io, socket) => {
	socket.on('chat message', (messages) => {
		io.to('room 1').emit('chat message', socket.pseudo + ' : ' + messages);
		let chatMessage = new Chat({
			message: messages,
			sender: socket.pseudo
		});
		chatMessage.save();
	});
};

exports.newUser = (io, socket) => {
	socket.on('new user', (newUser) => {

		console.log(newUser);
		let userId = newUser.userId;
		let email = newUser.email;
		console.log('Server username: ' + userId);
		console.log('Server email: ' + email);

		// Check if username is already registered in the server status database
		serverStatus.find({ name: 'Server Status' })
			.then(result => {
				let oldArray = result[0].usersOnline;
				console.log('Test de socket js ' + userId);

				if (oldArray.indexOf(userId) != -1) {

					User.findOne({ username: userId })
					.then(() => {
						socket.pseudo = userId;

						// If username is already registered, the user can enter the chatroom
						socket.join('room 1');

						// Tell the others that a new chatter has joined the chat
						socket.broadcast.to('room 1').emit('notification', (userId));

						// Retrieve all previous chat messages registered in the database
						Chat.find()
							.then(chat => socket.emit('chat retrieval', chat))
							.catch(error => console.log(error));
					})
					.catch(error => {
							console.log(error);
							socket.emit('username issue', "We couldn't find you. Please, try again to connect choosing a username");
					});
				}						

				// If username couldn't be found in the database, update server status with the username
				else {
					oldArray.push(userId);
					serverStatus.updateOne({ name: 'Server Status' }, {usersOnline: oldArray, usersOnlineNumber: oldArray.length})
						.then(() => {

							// Then update the corresponding user
							User.updateOne({ email: email }, { username: userId })
								.then(() => {								
									socket.pseudo = userId;

									// Join the room
									socket.join('room 1');

									// Tell the others
									socket.broadcast.to('room 1').emit('notification', (userId));

									// Retrieve all previous chat messages
									Chat.find()
									.then(chat => socket.emit('chat retrieval', chat))
									.catch(error => console.log(error));
								})
								.catch(error => {
									console.log(error);
									socket.emit('username issue', "We couldn't get your email adress. Please, try connecting again putting your email adress");
								});
						})
						.catch(error => console.log(error));
				}
			})
			.catch(error => console.log(error));	
		});	
};