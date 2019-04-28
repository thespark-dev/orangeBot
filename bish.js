const tfapi = require('tmi.js');
const fku = require('./config.json');
const fs = require('fs');
const api1 = require("twitch-helix");

const helix = new api1({
    clientId: "qmiywydnahqnwv1o84onmnope612w9",
    clientSecret: "9wac7pbphnopek1pu86a5not7i1tk3"
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

var conncted = false;
var prefix = fku.prefix;

function live(user) {
	return helix.getStreamInfoByUsername(user).then(twitchUser => {
		if(twitchUser === null){
			return false;
		} else {
			return true;
		}
	});
};

	live("not_orange").then(result => {
		if(result === true) {
			console.log("[LIVE] Live!");
			if(conncted != true){
				client.connect();
				conncted = true;
			}
		} else {
			console.log("[LIVE] Offline!");
			if(conncted === true){
				client.disconnect();
			}
		}
	});

setInterval(() => {

	live("not_orange").then(result => {
		if(result === true) {
			if(conncted != true){
				console.log("[LIVE] Live!");
				client.connect();
				conncted = true;
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

	if(cmd.toLowerCase() == `${preifx}bish`) {
		if(args != "") {
			client.action(channel, args + " you bish!");
		} else {
			client.action(channel, sender + " you bish!");
		}

	} else if (cmd.toLowerCase() == `${preifx}gey`) {
		if(args != "") {
			client.action(channel, args + " you gey!");
		} else {
			client.action(channel, sender + " you gey!");
		}

	} else if (message.toLowerCase().includes("no u")) {
		client.say(channel, "no u");

	} else if (cmd.toLowerCase() == `${preifx}ping`) {
		client.ping().then((data) => {
			let latenci = JSON.stringify(data[0]);
			let printthis = latenci.split(".");

			client.say(channel, sender + " -- " + printthis[1] + " ms");
		})

	} else if (cmd.toLowerCase() == `${preifx}commands` || cmd.toLowerCase() == `${preifx}cmds`) {
		client.action(channel, sender + " Her er alle commands til " + thefuckingoptions.identity.username + "!");
		setTimeout(() => {
			client.say(channel, `${preifx}bish > xD`);
			setTimeout(() => {
				client.say(channel, `${preifx}gey > :)`);
			}, 850);
				setTimeout(() => {
					client.say(channel, `${preifx}ping > Hvor lang tid det tager botten at kommunikere med Twitch`);
				}, 850);
		}, 850);
	}

});
