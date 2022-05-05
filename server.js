const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

// routes for mpesa
const mpesa = require("./routes/mpesa");

app.use(express.json());

app.use("/mpesa", mpesa);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
