import mongo from 'mongodb';
import assert from 'assert';
import bcrypt from 'bcrypt';

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

    if(isNewUser(_username)) {
      bcrypt.hash(_password, 10, (_err, _hash) => {
        assert.equal(null, _err, 'Error hashing password: ' + _err);
        console.log('Hash successfully created');

        users.insertOne({
          uuid:       a?(b|Math.random()*16>>b/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/1|0|(8)/g,c),
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
      //# TO-DO : callback error with user exists error
    }
}

const isNewUser = (_username) => {
  users.findOne({username: _username}, (_err, _res) => {
    return _err ? false : true;
  });
}
