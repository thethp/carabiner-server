import mongo from 'mongodb';
import assert from 'assert';
import bcrypt from 'bcrypt';

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new mongo.MongoClient(url);
const db;

client.connect((_err) => {
    assert.equal(null, _err, 'Error connecting to server: ' + _err);
    console.log('Connected to server successfully!');

    db = client.db(dbName);
    client.close();
});

export const register = (_username, _password) => {
    const collection = db.collection('users');
    //# TO-DO : Check to make sure user doesn't exist (findUser)

    bcrypt.hash(_password, 10, (_err, _hash) => {
	assert.equal(null, _err, 'Error hashing password: ' + _err);
	console.log('Hash successfully created');

	
    });
}

const findUser = (_username) => {
    
}
