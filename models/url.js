const { getDb } = require("../config/connection");
class Url {
  #db;
  constructor(original_url = null) {
    this.#db = getDb().collection("shortened_url");
    this.original_url = original_url;
  }
  static getNextSequenceValue() {
    const query = {
      _id: "urlid",
    };
    const newValue = {
      $inc: { sequence_value: 1 },
    };
    return getDb()
      .collection("counters")
      .updateOne(query, newValue)
      .then(() => {
        console.log("update success");
        return getDb().collection("counters").findOne({ _id: "urlid" });
      })
      .then((result) => {
        return result.sequence_value;
      })
      .catch((err) => {
        console.log("error occured", err);
        return err;
      });
  }
  async createShortUrl() {
    try {
      const findUrl = await this.#db.findOne({
        original_url: this.original_url,
      });
      if (findUrl !== null) {
        return findUrl;
      } else {
        const doc = {
          original_url: this.original_url,
          short_url: await Url.getNextSequenceValue(),
        };
        const result = await this.#db.insertOne(doc);
        return doc;
      }
    } catch (error) {
      console.log("error occured", error);
      return error;
    }
  }
  async getUrl(shortUrl) {
    try {
      const findUrl = await this.#db.findOne({
        short_url: shortUrl,
      });
      return findUrl;
    } catch (error) {
      console.log("error occured", error);
      return error;
    }
  }
}
module.exports = Url;
