const express = require("express");
const createHttpError = require('http-errors');
const path = require('path');
const port = 5000;

const app = express();

//use cors to allow cross origin resource sharing
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("url shortener app running");
});

//routes
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/shortURL"));

app.listen(port, () => {
  console.log(`url shortener app listening at http://localhost:${port}`);
});
