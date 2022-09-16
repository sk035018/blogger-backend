const { MongoClient } = require('mongodb');
const connectionString = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      const dbConnection = db.db(dbName);      
      console.log(`Successfully connected to MongoDB ==> ${dbName}.`);

      return callback(null, dbConnection);
    });
  },
};