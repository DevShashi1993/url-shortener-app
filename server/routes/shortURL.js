const router = require("express").Router();
const nanoid = require("nanoid");
// const authorize = require("../middleware/authorize");
const validateInfo = require("../middleware/validateInfo");
const pool = require("../db");
const crypto = require("crypto");

//create a Short URL, using authorize middleware
router.post("/shorturl", validateInfo, async (req, res) => {
  try {
    const { url, key } = req.body;

    if (url && key) {
      // find if api key is valid or not
      const userData = await pool.query(
        "SELECT user_id FROM users WHERE api_key = $1",
        [key]
      );

      if (userData.rowCount === 1) {
        // find if same url already exist in the DB
        const urlDataExist = await pool.query(
          "SELECT short_url FROM urlData WHERE original_url = $1",
          [url]
        );

        if (urlDataExist.rowCount === 1) {
          const { short_url } = urlDataExist.rows[0];
          return res.json({ short_url });
        }

        // else insert the original url in db and return thr generated shotr url
        else {
          const urlId = nanoid(10).replace(/[\W_]/g, "");
          const short_url = `http://localhost:5000/api/${urlId}`;

          const urlDataDB = await pool.query(
            "INSERT INTO urlData (url_id, original_url, short_url, created_on) VALUES ($1, $2, $3, current_timestamp) RETURNING short_url",
            [urlId, url, short_url]
          );

          if (urlDataDB.rowCount === 1) {
            const { short_url } = urlDataDB.rows[0];
            return res.json({ short_url });
          }
        }
      } else {
        return res.status(400).json("Invalid Api Key");
      }
    } else return res.status(400).json("Bad Request");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

router.post("/generatekey", validateInfo, async (req, res) => {
  try {
    const { userEmailId } = req.body;

    if (userEmailId) {
      // find if user email is valid or not
      const userExist = await pool.query(
        "SELECT user_id FROM users WHERE email = $1",
        [userEmailId]
      );

      if (userExist.rowCount === 1) {
        const { user_id } = userExist.rows[0];
        const newApiKey = crypto.randomBytes(16).toString("hex");

        const updatedUserData = await pool.query(
          "UPDATE users SET api_key=$1 WHERE user_id=$2 RETURNING *",
          [newApiKey, user_id]
        );

        const { api_key } = updatedUserData.rows[0];
        return res.json({ api_key });
      }

    } else return res.status(400).json("Bad Request");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

router.get("/:urlId", async (req, res) => {
  try {
    const urlId = req.params.urlId;

    const urlDataExist = await pool.query(
      "SELECT url_id, original_url FROM urlData WHERE url_id = $1",
      [urlId]
    );

    if (urlDataExist.rowCount === 1) {
      const { original_url } = urlDataExist.rows[0];
      return res.redirect(original_url);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
