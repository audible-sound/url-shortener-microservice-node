require("dotenv").config();
const { initDb } = require("./config/connection");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/", require("./routes/index"));

initDb((err, db) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(process.env.PORT, () => {
      console.log(`app listening on port ${process.env.PORT}`);
    });
  }
});
