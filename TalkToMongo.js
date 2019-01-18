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
  return new Promise((resolve, reject) => {
    console.log('Registering user');

    users.findOne({username: _username}, (_err, _res) => {

      if(_res) {
        console.log('User already exists');
        reject('User already exists');

      } else {
        console.log('User is new');

        bcrypt.hash(_password, 10, (_err, _hash) => {
          if(!_err) {
            reject('Error hashing password: ' + _err);
          }
          console.log('Hash successfully created');

          let uuid = uuidv4();
          users.insertOne({
            uuid:       uuid,
            username:   _username,
            password:   _hash,
            expoTokens: [_expoToken],
            contacts:   [],

          }, (_err, _result) => {
            if(!_err) {
              reject('Error adding user: ' + _err);
            }

            console.log('User successfully added');

            resolve(uuid);
          });
        });
      }
    });
  });
}