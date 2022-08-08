require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
let db = null;
const initDb = (callback) => {
  if (db) {
    console.log("Db connected!");
    return callback(null, db);
  } else {
    client
      .connect()
      .then((client) => {
        db = client.db();
        client
          .db()
          .createCollection("shortened_url")
          .then(() => {
            return db.createCollection("counters");
          })
          .then(() => {
            return callback(null, db);
          })
          .catch((err) => {
            if (err.codeName === "NamespaceExists") return callback(null, db);
            return callback(err);
          });
      })
      .catch((err) => {
        return callback(err);
      });
  }
};
const getDb = () => {
  if (db === null) throw new Error("Db failed to initialise");
  return db;
};
module.exports = {
  initDb,
  getDb,
};
