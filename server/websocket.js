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
wsServer.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wsServer.on('connection', (ws, req) => {
	// store socket in map
//	const userId = request.session.userId;
	//const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]; // get the ip of the client
	ws.uid = wsServer.getUniqueID();
	map.set(ws.uid, ws);

	logger.info('connected websocket:'+ ws.uid);
	ws.isAlive = true;
	ws.on('message', message => onmessage(ws, message));
	// remove client from map
	ws.on('close', function () {
		logger.info(`Websocket for client ${ws.uid} is closed`);
		map.delete(ws.uid);
	});
	sendMessage(ws.uid, {type: 'uid', payload: ws.uid});
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

const sendMessage = (uid, message ) => {
	ws = map.get(uid);
	let messageToSend = message;
	if (typeof message === 'object' && message !== null)
		messageToSend = JSON.stringify(message);
	if (message === null)
		messageToSend = "";
	if (ws)
		ws.send(messageToSend);
	else
		logger.error(`Websocket client is null or invalid for uid: ${uid}`);
}

module.exports = { wsServer, sendMessage }; 
