const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); 

const app = express();


dotenv.config();

const port = process.env.PORT || 5000; 

app.use(express.json());


connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(port, () => {
  console.log(`Product app listening on port ${port}`);
});
