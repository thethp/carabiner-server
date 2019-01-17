import mongo from 'mongodb';
import assert from 'assert';

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new mongo.MongoClient(url);

client.connect((_err) => {
    assert.equal(null, _err, 'Error connecting to server: ' + _err);
    console.log('Connected to server successfully!');

    const db = client.db(dbName);
    client.close();
});