let MongoClient = require('mongodb').MongoClient;
let database;

module.exports.connect = function(url, dbName, cb) {
  MongoClient.connect(url, (err, client) => {
    if (err) {console.log(err);}
    database = client.db(dbName);
    console.log('Connect to mongodb success');
    cb();
  });
};

module.exports.getCollection = function(collectionName) {
  return database.collection(collectionName);
};