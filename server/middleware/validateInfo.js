const { validateUrl, validEmail } = require("../utils/utils");

const validateInfo = (req, res, next) => {
  

  if (req.path === "/shorturl") {
    const { url } = req.body;
    if (!validateUrl(url)) {
      return res.json("Invalid URL");
    }
  } else if (req.path === "/login") {
    const {  email } = req.query;
    console.log(email);
    if (!validEmail(email)) {
      return res.json("Invalid Email");
    }
  } else if (req.path === "/signup") {
    const {  email } = req.body;
    if (!validEmail(email)) {
      return res.json("Invalid Email");
    }
  }

  next();
};

module.exports = validateInfo;
