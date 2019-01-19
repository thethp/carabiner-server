import express from 'express';

//# TO-DO : import these too? why am i doing this different?
const mongo = require('./mongoCommunication');
const notifications = require('./notifications');

const app = express();

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
  mongo.startHookup(req.body.uuid, req.body.hookupDetails)
  .then((_response) => {
    console.log('hookupHasBegun');

    notifications.startTimer(req.body.uuid, req.body.hookupDetails.checkInTime);

    res.json({success: true});
  })
  .catch((_error) => {
    console.log('Hookup could not be started');

    res.status(400).send({
      success: false,
      message: 'Hookup could not be started: ' + _error
    });
  });
});

const PORT_NUMBER = 80;

app.listen(PORT_NUMBER, () => {
    console.log(`Server online! @ Port: ${PORT_NUMBER}`);  
});
