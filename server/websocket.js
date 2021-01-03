const WebSocket = require('ws');
const { logger, ServerError } = require('./log');

const map = new Map();  // storing websockets by unique session id

/**
 * mark current websocket as alive
 * @param {websocket} ws 
 */
function heartbeat(ws) {
	ws.isAlive = true;
}

// handle messages from client
const onmessage = (ws, message) => {
	switch (message) {
		case 'pong':
			heartbeat(ws);
			break
		default:
			break
	}
}

// websocket server
const wsServer = new WebSocket.Server({ noServer: true });
wsServer.on('connection', (ws, req) => {
	// store socket in map
//	const userId = request.session.userId;
	const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]; // get the ip of the client
	map.set(ip, ws);

	logger.info('connected websocket:'+ ip);
	ws.isAlive = true;
	ws.on('message', message => onmessage(ws, message));

	// remove client from map
	ws.on('close', function () {
		map.delete(ip);
    });
});


/**
 * ping each client every 30000 miliseconds. 
 * if no response ("pong") then terminate the connection to the specific client
 */
const interval = setInterval(function ping() {
	wsServer.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.terminate();
		ws.isAlive = false;
		let ping = JSON.stringify({type: 'ping'});
		ws.send(ping);
	});
}, 30000);

// stop pinging when closing the server;
wsServer.on('close', function close() {
	clearInterval(interval);
});

const sendMessage = (ip, message ) => {
	ws = map.get(ip);
	let messageToSend = message;
	if (typeof message === 'object' && message !== null)
		messageToSend = JSON.stringify(message);
	if (message === null)
		messageToSend = "";
	ws.send(messageToSend);
}

module.exports = { wsServer, sendMessage }; 
