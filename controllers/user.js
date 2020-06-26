const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const serverStatus = require('../models/serverStatus');
const dotenv = require('dotenv');

dotenv.config();
const TOKEN = process.env.TOKEN;


exports.signup = (req, res, next) => {
	console.log('Requête reçue');
	bcrypt.hash(req.body.password, 10)
	.then(hash => {
		const user = new User({
			email: req.body.email,
			password: hash
		});

		user.save()
		.then(() => res.status(201).json({ message: 'User created !'}))
		.catch(error => res.status(400).json({ error }));
	})
	.catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	console.log('Demande reçue');

	// Find and compare user's email in the database with email sent in request
	User.findOne({ email: req.body.email })
	.then(user => {
		if (!user) {
			return res.status(401).json({ error: 'User not found !'})
		}

		// Compare user's password with password sent in request
		bcrypt.compare(req.body.password, user.password)
		.then(valid => {
			if (!valid) {
				return res.status(401).json({ error: 'Incorrect password'})
			}

			// Find server status in the database
			serverStatus.find({ name: 'Server Status' })
			.then(result => {
				let usernames = result[0].usersOnline;
				let newChoice = req.body.username;
				let regExp = /\W+/g;
				let idCheck = regExp.exec(newChoice);

				// Check if the username sent in request is already in the database
				if (usernames.indexOf(newChoice) != -1) {
					return res.status(401).json({ error: "Username already taken. Choose another one!" })
				} 

				// Check the username choice with a regular expression
				else if (idCheck) {
					return res.status(401).json({ error: "Please, do not use special caracters (like >,./)" })
				} 

				// Prepare variables for updating database
				else {
					let oldArray = result[0].usersOnline;
					let newArray = [];

					if (oldArray[0] != undefined) {

						for (let i = 0; i < oldArray.length; i++) {
							newArray.push(oldArray[i].toString());
						}

						newArray.push(req.body.username);
						console.log('oldArray pas indéfini');
						console.log(oldArray);
						console.log(newArray);
					} else {
						newArray.push(req.body.username);
						console.log(newArray[0]);
					}

					let numberCount = newArray.length;

					// Updating server status in the database with the new username and an increased users count matching the current online users
					serverStatus.updateOne({ name: 'Server Status' }, { usersOnline: newArray, usersOnlineNumber: numberCount})
					.then(() => { 

						// Updating username choice in the users' database
						User.updateOne({ email: req.body.email }, { username: req.body.username })
						.then(() => res.status(200).json({
							userId: user._id,
							username: req.body.username,
							email: req.body.email,
							message: 'User and Server updated !',
							token: jwt.sign(
								{ userId: user._id },
								TOKEN,
								{ expiresIn: '24h'}
								)
						}))
						.catch(error => res.status(400).json({ error }));							
					})
					.catch(error => res.status(400).json({ error }));

				}})
			.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));

	})
	.catch(error => res.status(500).json({ error }));
};