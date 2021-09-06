const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validateInfo = require("../middleware/validateInfo");
const pool = require("../db");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { log } = require("console");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/signup", validateInfo, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // TODO: make below code generic for inserting new user into db
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const apiKey = crypto.randomBytes(16).toString("hex");

      let newUser = await pool.query(
        "INSERT INTO users (first_name, last_name, email, password, api_key, created_on) VALUES ($1, $2, $3, $4, $5, current_timestamp) RETURNING email",
        [firstName, lastName, email, bcryptPassword, apiKey]
      );

      if (newUser.rows.length === 1) {
        return res.status(200).send("User registred sucessfully");
      }

      const jwtToken = jwtGenerator(newUser.rows[0].user_id);

      return res.json({ jwtToken });
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/login", validateInfo, async (req, res) => {
  try {
    const { email, password } = req.query;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("User does not exist");
    } else {
      // TODO: make belew code genric to verify user already exist in db
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (!validPassword) {
        return res.status(401).json("Authorization Failed: Invalid Credentials");
      } else {
        const jwtToken = jwtGenerator(user.rows[0].user_id);

        const { user_id, first_name, last_name, email, api_key } = user.rows[0];
  
        return res.json({
          user_id,
          first_name,
          last_name,
          email,
          api_key,
          jwtToken,
        });
      }  
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/tokensignin", async (req, res) => {
  try {
    const { idtoken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: idtoken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const {
      given_name: firstName,
      family_name: lastName,
      email: email,
      sub: password,
    } = ticket.getPayload();

    console.log(firstName, lastName, email, password);

    // TODO: make below code generic for inserting new user into db
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      console.log("google user already exists with same email id");
      // TODO: make belew code genric to verify user already exist in db
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (!validPassword) {
        return res.status(401).json("Already signed up with same account. Please sign in with existing email and password");
      }

      const jwtToken = jwtGenerator(user.rows[0].user_id);

      const { user_id, first_name, last_name, email, api_key } = user.rows[0];

      return res.json({
        user_id,
        first_name,
        last_name,
        email,
        api_key,
        jwtToken,
      });
    } else {
      console.log("adding google user into the db");
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const apiKey = crypto.randomBytes(16).toString("hex");

      let newUser = await pool.query(
        "INSERT INTO users (first_name, last_name, email, password, api_key, created_on) VALUES ($1, $2, $3, $4, $5, current_timestamp) RETURNING email",
        [firstName, lastName, email, bcryptPassword, apiKey]
      );

      if (newUser.rows.length === 1) {
        const jwtToken = jwtGenerator(newUser.rows[0].user_id);

        const { user_id, first_name, last_name, email, api_key } = newUser.rows[0];

        return res.json({
          user_id,
          first_name,
          last_name,
          email,
          api_key,
          jwtToken,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
