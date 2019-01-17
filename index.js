import express from 'express';
import Expo from 'expo-server-sdk';

import mongo from 'mongodb';
import assert from 'assert';

const url = 'mongod://localhost:27017';
const dbName = 'test';
const client = new mongo.MongoClient(url);

client.connect((_err) => {
	assert.equal(null, _err, 'Error connecting to server: ' + _err);
	console.log('Connected to server successfully!');

	const db = client.db(dbName);

	insertDocuments(db, function() {
	    client.close();
	  });
});


const app = express();
const expo = new Expo();

let savedTokens = [];
//#TO-DO : set up server with forever or similar
//#TO-DO : store token in users database, so we can notify them
//#TO-DO : how to pop notification even if app open

const saveToken = (token => {
    if (savedTokens.indexOf(token === -1)) {
	savedTokens.push(token);
    }
});

const handlePushTokens = (message) => {
    let notifications = [];

    for (let pushToken of savedTokens) {
	if(!Expo.isExpoPushToken(pushToken)) {
	    console.error(`Push token ${pushToken} is not a valid Expo push token`);
	    continue;
	}

	notifications.push({
	    to: pushToken,
	    sound: 'default',
	    title: 'Message received',
	    body: message,
	    data: { message }
	});
    }

    let chunks = expo.chunkPushNotifications(notifications);
    console.log('preparing to send chunks');
    (async () => {
	for (let chunk of chunks) {
	    try {
		let receipts = await expo.sendPushNotificationsAsync(chunk);
		console.log(receipts);
	    } catch (error) {
		console.error(error);
	    }
	}
    })();
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Running');
});

app.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    res.send(`Received push token, ${req.body.token.value}`);
});

app.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log(`Received message, ${req.body.message}`);
    res.send(`Received message, ${req.body.message}`);
});

//#TO-DO: figure out best port number / api.carabiner.xyz
const PORT_NUMBER = 80;

app.listen(PORT_NUMBER, () => {
    console.log(`Server online! @ Port: ${PORT_NUMBER}`);  
});
