import Expo from 'expo-server-sdk';

const expo = new Expo();
const mongo = require('./mongoCommunication');

export const startTimer = (_uuid, _time) => {
  console.log('Starting the timer');

  setTimeout(() => { checkIn(_uuid); }, _time*60000);
}

const checkIn = (_uuid) => {
  console.log('Stopping the timer');

  mongo.getHookupDetails(_uuid)
  .then((_response) => {
    console.log('Hookup Details Claimed: ', _response);

    if(_response.isHookingUp) {
      console.log('Send check-in alert');

      sendAlert(_response.expoTokens, _response.hookUpDetails.username);
    } else {
      console.log('Were not hooking up');

    }
  })
  .catch((_error) => {
    console.log('Hookup details could not be gotten.');

  });
}


const sendAlert = (_tokenArray, _hookupName) => {
  console.log('Send the alert');

	//# TO-DO : only send to the one user
  let notifications = [];
  let message = 'You hooked up with ' + _hookupName + '. Let us know alls well.';

  for (let pushToken of _tokenArray) {

		if(!Expo.isExpoPushToken(pushToken)) {
	    console.log(`Push token ${pushToken} is not a valid Expo push token`);
	    continue;
		}

		notifications.push({
	    to: pushToken,
	    sound: 'default',
	    title: 'Carabiner',
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