const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.MONGOLAB_URI;

const userRoutes = require('./routes/user');

mongoose.connect(url,
{
	useNewUrlParser: true, 
	useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => console.log('Connexion à MongoDB échouée !' + ' ' + error));



const app = express();

app.io = require('socket.io')();
const routes = require('./routes/socket')(app.io);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(bodyParser.json());

app.use('/', routes);

const frontend = __dirname.replace('backend', 'frontend');

app.get('/', (req, res, next) => {
	res.sendFile(frontend + '/authentification.html');
});

app.use('/chat', userRoutes);

app.use(express.static(frontend));

module.exports = app;