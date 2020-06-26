const http = require('http');
const app = require('./app');

const normalisePort = val => {
	const port = parseInt(val, 10)

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

const port = normalisePort(process.env.PORT || '3000');

const server = http.createServer(app);
app.io.attach(server);

server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port);

module.exports = server;
