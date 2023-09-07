process.env.UV_THREADPOOL_SIZE = 1;

const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = 8080;

// http://127.0.0.1:8080/register?username=matt&password=password
// .\ab -c 50 -n 1000 "http://127.0.0.1:8080/auth?username=matt&password=password"
// NODE_ENV=production node --prof app.js
// node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt

const users = [];

app.get("/register", (req, res) => {
  let username = req.query.username || "";
  const password = req.query.password || "";

  username = username.replace(/[!@#$%^&*]/g, "");

  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }

  const salt = crypto.randomBytes(128).toString("base64");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512"); // Password-Based Key Derivation Function

  users[username] = { salt, hash };

  res.sendStatus(200);
});

app.get("/auth", (req, res) => {
  let username = req.query.username || "";
  const password = req.query.password || "";

  username = username.replace(/[!@#$%^&*]/g, "");

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  const { salt, hash } = users[username];

  // const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
  // if (crypto.timingSafeEqual(hash, encryptHash)) {
  //   res.sendStatus(200);
  // } else {
  //   res.sendStatus(401);
  // }

  crypto.pbkdf2(password, salt, 10000, 512, "sha512", (err, encryptHash) => {
    if (crypto.timingSafeEqual(hash, encryptHash)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Server listening on PORT", PORT);
});
