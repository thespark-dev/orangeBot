const tfapi = require('tmi.js');
const fku = require('./config.json');
const fs = require('fs');
const api1 = require("twitch-helix");

const helix = new api1({
    clientId: "qmiywydnahqnwv1o84onmnope612w9",
    clientSecret: "9wac7pbphnopek1pu86a5not7i1tk3"
});

var joinchnl = '';

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
	channels: [ joinchnl ]
};

const client = new tfapi.client(thefuckingoptions);

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

live(joinchnl).then(result => {
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

	live(joinchnl).then(result => {
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

// client.on("connected", (addr,port) => {
//   client.action(joinchnl,  ` er kommet ind i chatrummet!`);
// });

client.on('chat', (channel, userstate, message, self) => {
	if(self) return;

	let sender = userstate['display-name'];

	let msg = message.split(' ');
	let args = msg.slice(1);
	let cmd = msg[0];

	if(cmd.toLowerCase() == `${prefix}bish`) {
		if(args != "") {
			client.action(channel, args + " you bish!");
		} else {
			client.action(channel, sender + " you bish!");
		}

	} else if (cmd.toLowerCase() == `${prefix}gey`) {
		if(args != "") {
			client.action(channel, args + " you gey!");
		} else {
			client.action(channel, sender + " you gey!");
		}

	} else if (message.toLowerCase().includes("no u")) {
		client.say(channel, "no u");

	} else if (cmd.toLowerCase() == `${prefix}ping`) {

	  client.ping().then((data) => {

			let latenci = JSON.stringify(data[0]);

			let printthis = latenci.split(".");

      if(printthis[0] > 0) {
        client.say(channel, sender + " - " + latenci + " sekunder");
      } else {
			  client.say(channel, sender + " - ." + printthis[1] + " ms");
      }

		})
  	} else if (cmd.toLowerCase() == `${preifx}commands` || cmd.toLowerCase() == `${preifx}cmds`) {
		client.action(channel, sender + " Her er alle commands til " + joinchnl + "!");
		setTimeout(() => {
			client.say(channel, `${preifx}bish > :)`);
			setTimeout(() => {
				client.say(channel, `${preifx}gey > :)`);
				setTimeout(() => {
					client.say(channel, `${preifx}ping > Hvor lang tid det tager botten at kommunikere med Twitch`);
					setTimeout(() => {
						client.say(channel, `${preifx}uptime > Hvor lang tid streamen har kørt.`);
					}, 850);
				}, 850);
			}, 850);
		}, 850);
	} else if (cmd.toLowerCase() == `${prefix}uptime`) {
	    helix.getStreamInfoByUsername(joinchnl).then(twitchUser => {
	      if(twitchUser != null) {

	        var date1 = new Date(twitchUser.started_at);
	        var date2 = new Date()

	        var res = Math.abs(date1 - date2) / 1000;

	        var hrs = Math.floor(res / 3600) % 24;
	        var min = Math.floor(res / 60) % 60;
	        var sec = Math.floor(res % 60);

	        if (hrs < 10) {hrs = "0"+hrs;}
	        if (min < 10) {min = "0"+min;}
	        if (sec < 10) {sec = "0"+sec;}

	        if (hrs < 1) { client.say(channel, `${sender} - ${joinchnl} har været live I ${min} minutter ${sec} sekunder`); }
	        else { client.say(channel, `${sender} - ${joinchnl} har været live I ${hrs} timer ${min} minutter ${sec} sekunder`); }
	      } else {
	        console.log("Offline");
	        client.say(channel, `${sender} - ${joinchnl} er Offline.`);
	      }
	    })
	}

});
