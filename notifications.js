let savedTokens = [];
//#TO-DO : how to pop notification even if app open

const saveToken = (token => {
    if (savedTokens.indexOf(token === -1)) {
	savedTokens.push(token);
    }
});

export const handlePushTokens = (message) => {
	//# TO-DO : only send to the one user
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