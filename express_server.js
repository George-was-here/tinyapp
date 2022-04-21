const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
let cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/urls", (req, res) => {
  const templateVars = {
    user: null,
    urls: urlDatabase };
  if (req.cookies && req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: null,
    urls: urlDatabase };
  if (req.cookies && req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, user: null, longURL: urlDatabase[req.params.shortURL] };
  if (req.cookies && req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  res.redirect(url);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const templateVars = { user: null };
  if (req.cookies && req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: null };
  if (req.cookies && req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_login", templateVars);
});


//--------------get/post_wall_DO_NOT_CROSS😤👺-------------------//


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.updatedURL;
  res.redirect("/urls/");
});

app.post("/login", (req, res) => {
  const emailValue = req.body.email;
  const passwordValue = req.body.password;
  if (!emailAlreadyInUse(emailValue)) {
    res.status(403);
    res.end("403: Error, email could not be located!");
    return;
  }
  const user = findUserViaEmail(emailValue);
  if (user) {
    if (user.password !== passwordValue) {
      res.status(403);
      res.end("403: Error, password is invalid.");
      return;
    }
    res.cookie('user_id', user.id);
    res.redirect("/urls/");
  }
});

// If a user with that e-mail address is located, compare the password given in the form with the existing user's password. If it does not match, return a response with a 403 status code.
// If both checks pass, set the user_id cookie with the matching user's random ID, then redirect to /urls.

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls/");
});

app.post("/register", (req, res) => {
  const emailValue = req.body.email;
  const passwordValue = req.body.password;
  if (emailValue === '' || passwordValue === '') {
    res.status(400);
    res.end("400: Error, cannot submit an empty email/password.");
    return;
  }
  if (emailAlreadyInUse(emailValue)) {
    res.status(400);
    res.end("400: Error, email already in use!");
    return;
  }
  const id  = generateRandomString();
  const user = {
    id: id,
    email: emailValue,
    password: passwordValue
  };
  users[id] = user;
  res.cookie("user_id", id);
  res.redirect(`/urls`);
});




const generateRandomString = () => {
  return Buffer.from(Math.random().toString()).toString("base64").substr(10, 6);
};

const emailAlreadyInUse = (newEmail) => {
  for (const user in users) {
    if (users[user].email === newEmail) {
      return true;
    }
  }
  return false;
};

const findUserViaEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});