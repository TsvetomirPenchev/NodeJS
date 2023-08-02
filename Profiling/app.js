const crypto = require("crypto");
const express = require("express");
const app = express();
const PORT = 8080;

const users = [];

// curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
// .\ab -k -c 20 -n 100 "http://localhost:8080/auth?username=matt&password=password"

app.get("/newUser", (req, res) => {
  let username = req.query.username || "";
  const password = req.query.password || "";

  username = username.replace(/[!@#$%^&*]/g, "");

  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }

  const salt = crypto.randomBytes(128).toString("base64");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");

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

  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    "sha512",
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Server listening on PORT", PORT);
});