import twilio from 'twilio';

var client = new twilio('AC84db0413a4c2ac9e29bb1f73ccd50960', '094c47a67e9c9e6bfe9c9245fc450d9a');

export const sendSMS = (_contactPhone, message) => {
  console.log('Time to send this SMS');
	client.messages.create({
	  to: _contactPhone,
	  from: '+18608524576',
	  body: _message
	})
  .then(message => console.log('Message sent: ', message.sid))
  .done();;
}