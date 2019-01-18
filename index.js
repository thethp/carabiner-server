import express from 'express';
import Expo from 'expo-server-sdk';

//# TO-DO : import these too? why am i doing this different?
const mongo = require('./mongoCommunication');
const notifications = require('./notifications');

const app = express();
const expo = new Expo();

app.use(express.json());

//#TO-DO : only allow api access from my app.

//GET CALLS

app.get('/', (req, res) => {
  res.send('Server Running');
});

//uuid refers to users uuid
app.get('/getContacts/:uuid', (req, res) => {
  mongo.getContacts(req.params.uuid)
  .then((_response) => {
    console.log('Contacts retrieved');

    res.json({success: true, contacts: _response});
  })
  .catch((_error) => {
    console.log('Contact retrieval failed.');

    res.status(400).send({
      success: false,
      message: 'Getting contacts failed: ' + _error
    });
  });
});

//uuid refers to users uuid, contactUuid refers to... you get it
app.get('/getContacts/:uuid/specificContact/:contactUuid', (req, res) => {
  mongo.getContact(req.params.uuid, req.params.contactUuid)
  .then((_response) => {
    console.log('Contact retrieved');

    res.json({success: true, contact: _response});
  })
  .catch((_error) => {
    console.log('Contact retrieval failed.');

    res.status(400).send({
      success: false,
      message: 'Getting contacts failed: ' + _error
    });
  });
});


//POST CALLS

app.post('/register', (req, res) => {
  mongo.register(req.body.user.username, req.body.user.password, req.body.token.value)
  .then((_response) => {
  	console.log('User Registered');

  	res.json({success: true, uuid: _response});
  })
  .catch((_error) => {
  	console.log('User registration failed.');

  	res.status(400).send({
  		success: false,
  		message: 'User registration failed: ' + _error
  	});
  });
});

app.post('/login', (req, res) => {
    mongo.login(req.body.user.username, req.body.user.password, req.body.token.value)
    .then((_response) => {
    	console.log('User logged in');

    	res.json({success: true, uuid: _response});
    })
    .catch((_error) => {
    	console.log('User login failed.');

    	res.status(400).send({
    		success: false,
    		message: 'User login failed: ' + _error
    	});
    });
});

app.post('/addEditContact', (req, res) => {
  mongo.addEditContact(req.body.uuid, req.body.contactDetails)
  .then((_response) => {
    console.log('Contacts updated');

    res.json({success: true});
  })
  .catch((_error) => {
    console.log('Contact could not be added');

    res.status(400).send({
      success: false,
      message: 'Contact could not be added: ' + _error
    });
  });
});

app.post('/startHookup', (req, res) => {
  //mongo.startHookup(req.body.uuid,)
});

app.post('/message', (req, res) => {
    notifications.handlePushTokens(req.body.message);
    console.log(`Received message, ${req.body.message}`);
    res.send(`Received message, ${req.body.message}`);
});

const PORT_NUMBER = 80;

app.listen(PORT_NUMBER, () => {
    console.log(`Server online! @ Port: ${PORT_NUMBER}`);  
});
