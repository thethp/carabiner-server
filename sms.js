import twilio from 'twilio';

var client = new twilio('HIDDEN', 'HIDDEN');
// #TO-DO: set up this project to use a .env file

export const sendSMS = (_contactPhone, _message) => {
  console.log('Time to send this SMS');
	client.messages.create({
	  to: _contactPhone,
	  from: '+18608524576',
	  body: _message
	})
  .then(message => console.log('Message sent: ', message.sid))
  .done();;
}