import React, { createContext } from 'react'
import { useDispatch } from 'react-redux';
import { showMessage, connected, uploadResult } from '../actions/index';

const WebSocketContext = createContext(null)

export { WebSocketContext }

const MAX_TIMEOUT = 10000;
const MIN_TIMEOUT = 250;

export default ({ children }) => {
	var socket = null;
	var timeout = MIN_TIMEOUT;
	var connectInterval = null;
	var pingTimeout = null;
	var ws = {};
	var lastState = WebSocket.CLOSED;
	//const that = this;

	const dispatch = useDispatch();

	/**
	  * used by the @function connect to check if the connection is close, if so attempts to reconnect
	  */
	const check = () => {
		if (!socket || socket.readyState === WebSocket.CLOSED) {
			socket = null;
			connect(); //check if websocket instance is closed, if so call `connect` function.
		}
	};

	/**
	 * used to check if connection still alive
	 */
	function heartbeat() {
		clearTimeout(pingTimeout);

		// Use `WebSocket#terminate()`, which immediately destroys the connection,
		// instead of `WebSocket#close()`, which waits for the close timer.
		// Delay should be equal to the interval at which your server
		// sends out pings plus a conservative assumption of the latency.
		pingTimeout = setTimeout(() => {
			socket.close();
		}, 30000 + 2000);
	}

	const sendMessage = (roomId, message) => {
		const payload = {
			roomId: roomId,
			data: message
		}
		this.state.socket.emit("event://send-message", JSON.stringify(payload));
		dispatch(showMessage(message));
	}

	const connect = () => {
		if (!socket) {
			let webSocket = new WebSocket(`wss://${process.env.REACT_APP_SERVER}/api`);

			webSocket.onopen = () => {
				//setWS( { socket: webSocket, sendMessage });
				ws = { socket: webSocket, sendMessage };
				timeout = MIN_TIMEOUT; // reset timer to 250 on open of websocket connection 
				clearTimeout(connectInterval); // clear Interval on on open of websocket connection
				heartbeat();
				dispatch(connected(true));
				lastState = webSocket.readyState;
			};

			// start reconnect;
			webSocket.onclose = (event) => {
				timeout = timeout * 2; //increment retry interval
				connectInterval = setTimeout(check, Math.min(MAX_TIMEOUT, timeout)); //call check function after timeout 
				if (lastState===WebSocket.OPEN) {
					lastState = webSocket.readyState;
					dispatch(connected(false));
				}
			}

			webSocket.onmessage = (event) => {
				let data = event.data;
				try{
					data = JSON.parse(event.data);
				}
				catch(error){
				}
				switch (data.type) {
					case 'ping':
						webSocket.send("pong");
						heartbeat();
						break
					case 'upload_result':
						dispatch(uploadResult(data.payload));
						break
					default:
						break
				}
			}
			socket = webSocket;
		}
	}
	connect();

	return (
		<WebSocketContext.Provider value={ws}>
			{children}
		</WebSocketContext.Provider>
	)
}