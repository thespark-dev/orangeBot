const tfapi = require('tmi.js');
const fku = require('./config.json');
const fs = require('fs');
const api1 = require("twitch-helix");

const helix = new api1({
    clientId: "qmiywydpybqnwv1o84onmjqgc612w9",
    clientSecret: "9wac7pbph695xk1pu86a5ab87i1tk3"
});

const thefuckingoptions = {
	options: {
		debug: true
	},
	connection: {
		cluster: 'aws',
		reconnect: true
	},
	identity: {
		username: 'theeSparkBot', // Bot Username
		password: fku.token
	},
	channels: [ 'not_orange' ]
};

const client = new tfapi.client(thefuckingoptions);
//client.connect();

const conncted = false;

function live(user) {
	return helix.getStreamInfoByUsername(user).then(twitchUser => {
		if(twitchUser === null){
			return false;
		} else {
			return true;
		}
	});
};

setInterval(() => {

	live("not_orange").then(result => {
		if(result === true) {
			console.log("[LIVE] Live!");
			if(conncted != true){
				client.connect();
			}
		} else {
			console.log("[LIVE] Offline!");
			if(conncted === true){
				client.disconnect();
			}
		}
	});

},120000);

process.stdin.resume();

client.on('chat', (channel, userstate, message, self) => {
	if(self) return;

	let sender = userstate['display-name'];

	let msg = message.split(' ');
	let args = msg.slice(1);
	let cmd = msg[0];

	if(cmd.toLowerCase() == "-bish") {
		if(args != "") {
			client.action(channel, args + " you bish!");
		} else {
			client.action(channel, sender + " you bish!");
		}
	} else if (cmd.toLowerCase() == "-gey") {
		if(args != "") {
			client.action(channel, args + " you gey!");
		} else {
			client.action(channel, sender + " you gey!");
		}
	} else if (message.toLowerCase().includes("no u")) {
		client.say(channel, "no u");
	}

	if(message.includes("bitchute.com")) {
        if(userstate['mod'] === false) {
                client.timeout(channel, sender, 300, "Bitchute er dødt...");
                client.say(channel, sender + " -- Fuck af med dit bitchute pis... (5 minutters timeout)")
        }
	}

});