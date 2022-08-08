const { initDb } = require("../config/connection");
initDb((err, db) => {
  if (err) throw err;
  else {
    db.collection("counters")
      .insertOne({
        _id: "urlid",
        sequence_value: 0,
      })
      .then(() => {
        console.log("seed success");
        db.close();
      })
      .catch((err) => {
        throw err;
      });
  }
});
