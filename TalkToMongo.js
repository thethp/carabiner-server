import mongo from 'mongodb';
import assert from 'assert';
import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new mongo.MongoClient(url);
var users;

client.connect((_err) => {
  assert.equal(null, _err, 'Error connecting to server: ' + _err);
  console.log('Connected to server successfully!');

  let db = client.db(dbName);
  users = db.collection('users');
});

export const register = (_username, _password, _expoToken) => {
  console.log('Registering user');

    if(isNewUser(_username)) {
      console.log('User is new');
      bcrypt.hash(_password, 10, (_err, _hash) => {
        assert.equal(null, _err, 'Error hashing password: ' + _err);
        console.log('Hash successfully created');

        users.insertOne({
            uuid:      uuidv4(),
          username:   _username,
          password:   _hash,
          expoTokens: [_expoToken],
          contacts:   [],
        }, (_err, _result) => {
          assert.equal(null, _err, 'Error adding user: ' + _err);
          console.log('User successfully added');

          //# TO-DO : callback error or success depending.
        });
      });
    } else {
      console.log('user exists');
      //# TO-DO : callback error with user exists error
    }
}

const isNewUser = (_username) => {
  users.findOne({username: _username}, (_err, _res) => {
      assert.equal(null, _err, 'Error finding user: ' + _err);

      return _res ? false : true;
  });
}
