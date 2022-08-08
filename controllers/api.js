const dns = require("dns");
const URL = require("url");
const Url = require("../models/url");
class ApiController {
  static postUrl(req, res) {
    const { url } = req.body;
    const { host } = URL.parse(url);
    if (host === null) res.status(400).send({ error: "invalid url" });
    dns.lookup(host, async (err) => {
      try {
        if (err) {
          throw new Error("invalid url");
        }
        const url_instance = new Url(url);
        const result = await url_instance.createShortUrl();
        res.status(200).send({
          original_url: result.original_url,
          short_url: result.short_url,
        });
      } catch (error) {
        let code = 500;
        let message = err;
        if (error.message === "invalid url") {
          message = error.message;
          code = 400;
        }
        res.status(code).send({ error: message });
      }
    });
  }
  static async redirectSite(req, res) {
    try {
      const url = Number(req.params.url);
      const url_instance = new Url();
      const original_url = await url_instance.getUrl(url);
      if (original_url === null) throw new Error("not found");
      res.redirect(original_url.original_url);
    } catch (error) {
      let code = 500;
      let message = error;
      if (error.message === "not found") {
        code = 404;
        message = "Site does not exist";
      }
      res.status(code).send({
        error: message,
      });
    }
  }
}

module.exports = ApiController;
