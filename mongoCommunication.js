import mongo from 'mongodb';
import assert from 'assert';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';

const url = 'mongodb://localhost:27017';
//# TO-DO : switch to a non-test server
const dbName = 'YOUR_DB_NAME';
//# TO-DO : Use env file
const client = new mongo.MongoClient(url);
var users;

client.connect((_err) => {
  assert.equal(null, _err, 'Error connecting to server: ' + _err);
  console.log('Connected to server successfully!');

  let db = client.db(dbName);
  users = db.collection('YOUR_COLLECTION_NAME');
});


//ADD CONTACT
export const addEditContact = (_uuid, _contactDetails) => {
  console.log('Updating Contacts');

  return new Promise((resolve, reject) => {
    users.findOne({uuid: _uuid}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);
      let user = _res;

      if(user) {
        console.log('User found: ', user.contacts);

        let contactLocation = -1;
        user.contacts.forEach((contact, i) => {
          if(contact.phone == _contactDetails.phone || contact.uuid == _contactDetails.uuid) {
            contactLocation = i;
          }
        });

        if(contactLocation >= 0) {
          user.contacts[contactLocation] = _contactDetails;

          console.log('Contact updated:');
        } else {
          _contactDetails.uuid = uuidv4();
          user.contacts.push(_contactDetails);

          console.log('Contact added:');
        }

        users.updateOne(
          { uuid: _uuid },
          { $set: { contacts: user.contacts } },
          (_err, _res) => {
            if(_err) {
              reject('Error updating contacts: ' + _err);
            } else {
              resolve(true);
            }
          }
        );

      } else {
        reject('User not found');

      }
    });
  });
}

//END HOOKUP DETAILS
export const endHookup = (_uuid) => {
  console.log('Ending hookup');

  return new Promise((resolve, reject) => {
    users.findOne({uuid: _uuid}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);

      let user = _res;

      if(user) {
        console.log('Ending Hookup entirely')
        
        users.updateOne(
          { uuid: _uuid },
          { $set: { 
            isHookingUp: false,
            hookUpDetails: {},
          } },
          (_err, _res) => {
            if(_err) {
              reject('Error ending hookup: ' + _err);
            } else {
              resolve(true);
            }
          }
        );

      } else {
        console.log("User doesn't exist");
        reject("User doesn't exist");

      }
    });
  });
}

//# TO-DO : universalize contact/friend language
//GET CONTACT
export const getContact = (_uuid, _contactUuid) => {
  console.log('Getting specific contact');

  return new Promise((resolve, reject) => {
    users.findOne({uuid: _uuid}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);

      let { contacts } = _res;
      let contactLocation = -1;

      contacts.forEach((contact, i) => {
        if(contact.uuid == _contactUuid) {
          contactLocation = i;
        }
      });

      if(contactLocation >= 0) {
        resolve(contacts[contactLocation]);

        console.log('Contact found.');
      } else {
        reject("Contact doesn't exist")

        console.log("Contact doesn't exist");
      }

    });
  });
}

//GET CONTACTS
export const getContacts = (_uuid) => {
  console.log('Getting list of contacts');

  return new Promise((resolve, reject) => {
    users.findOne({uuid: _uuid}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);

      let user = _res;

      if(user) {
        console.log('Returning contacts;')
        resolve(user.contacts);

      } else {
        console.log("User doesn't exist");
        reject("User doesn't exist");

      }
    });
  });
}



//GET HOOKUP DETAILS
export const getHookupDetails = (_uuid) => {
  console.log('Getting hookup details');

  return new Promise((resolve, reject) => {
    users.findOne({uuid: _uuid}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);

      let user = _res;

      if(user) {
        console.log('Returning hookup details;')
        resolve({
          isHookingUp: user.isHookingUp,
          expoTokens: user.expoTokens,
          hookUpDetails: user.hookUpDetails,
        });

      } else {
        console.log("User doesn't exist");
        reject("User doesn't exist");

      }
    });
  });
}


//LOGIN
export const login = (_username, _password, _expoToken) => {
  console.log('Logging in user');
  
  return new Promise((resolve, reject) => {
    users.findOne({username: _username}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);

      let user = _res;

      if(user) {
        bcrypt.compare(_password, user.password, (_err, _res) => {
          if(_res) {
            console.log('Password correct: Log in');
            
            //if expotoken isn't the same, add this one [we want to push to every device they have]
            if(!user.expoTokens.includes(_expoToken)) {
              user.expoTokens.push(_expoToken);

              users.updateOne(
                {username: _username},
                { $set: { expoTokens: user.expoTokens } }
              );
            }

            resolve(user.uuid);

          } else {
            reject('Wrong password');

          }
        });
      } else {
        console.log("User doesn't exist");
        reject("User doesn't exist");

      }
    });
  });
}


//REGISTER
export const register = (_username, _password, _expoToken) => {
  console.log('Registering user');

  return new Promise((resolve, reject) => {
    users.findOne({username: _username}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);
      
      if(_res) {
        console.log('User already exists');
        reject('User already exists');

      } else {
        console.log('User is new');

        bcrypt.hash(_password, 10, (_err, _hash) => {
          assert.equal(null, _err, 'Error hashing password: ' + _err);
          console.log('Hash successfully created');

          let uuid = uuidv4();
          users.insertOne({
            uuid:          uuid,
            username:      _username,
            password:      _hash,
            expoTokens:    [_expoToken],
            contacts:      [],
            isHookingUp:   false,
            hookUpDetails: {}

          }, (_err, _result) => {
            assert.equal(null, _err, 'Error adding user: ' + _err);
            console.log('User successfully added');

            resolve(uuid);
          });
        });
      }
    });
  });
}

//START HOOKUP
export const startHookup = (_uuid, _hookupDetails) => {
  console.log('Starting Hookup');

  return new Promise((resolve, reject) => {
    users.findOne({uuid: _uuid}, (_err, _res) => {
      assert.equal(null, _err, 'Error starting hookup: ' + _err);
      let user = _res;

      if(user) {

        users.updateOne(
          { uuid: _uuid },
          { $set: { 
            hookUpDetails: _hookupDetails, 
            isHookingUp: true,
          } },
          (_err, _res) => {
            if(_err) {
              reject('Error starting Hookup: ' + _err);
            } else {
              resolve(true);
            }
          }
        );

      } else {
        reject('User not found');

      }
    });
  });
}