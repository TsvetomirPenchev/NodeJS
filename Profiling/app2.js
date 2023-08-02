const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8080;

const users = [];

// .\ab -k -c 20 -n 300 "http://3.120.206.144:8080/file"
// NODE_ENV=production node --prof app.js

app.get("/file", (req, res) => {
  const text = fs.readFileSync("text.txt");

  res.set("Content-Type", "text/html");
  res.send(text);
});

app.get("/fileStream", (req, res) => {
  const stream = fs.createReadStream("text.txt");

  res.set("Content-Type", "text/html");
  stream.pipe(res);
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Server listening on PORT", PORT);
});
