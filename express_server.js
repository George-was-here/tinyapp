const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
require("dotenv").config();

const { emailAlreadyInUse, generateRandomString, findUserViaEmail, urlsForUser } = require('./helpers');

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cookieSession({
    name: "session",
    keys: [
      "Making itty bitty micro URLs for small incremental webpage queries.",
    ],
  })
);

app.set("view engine", "ejs");
const salt = bcrypt.genSaltSync(10);

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userid: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userid: "user2RandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", salt)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", salt)
  }
};

app.get("/urls", (req, res) => {
  if (req.session && req.session["user_id"]) {
    const templateVars = {
      user: null,
      urls: urlsForUser(urlDatabase, req.session["user_id"]) };
    if (req.session && req.session["user_id"]) {
      templateVars.user = users[req.session["user_id"]];
    }
    res.render("urls_index", templateVars);
    return;
  }
  res.status(403);
  res.end("403: Error, user must login to see URLs!");
  return;
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: null,
    urls: urlDatabase };
  if (req.session && req.session["user_id"]) {
    templateVars.user = users[req.session["user_id"]];
    res.render("urls_new", templateVars);
    return;
  }
  res.redirect("/login");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, user: null, longURL: urlDatabase[req.params.shortURL].longURL };
  if (req.session && req.session["user_id"]) {
    templateVars.user = users[req.session["user_id"]];
    if (urlDatabase[req.params.shortURL].userid === req.session["user_id"]) {
      res.render("urls_show", templateVars);
      return;
    } else {
      res.status(403);
      res.end("403: Error, query item does not match account holdings!");
      return;
    }
  }
  res.status(403);
  res.end("403: Error, user must login to see URLs!");
  return;
});


app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL].longURL;
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
  if (req.session && req.session["user_id"]) {
    templateVars.user = users[req.session["user_id"]];
  }
  res.render("urls_registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: null };
  if (req.session && req.session["user_id"]) {
    templateVars.user = users[req.session["user_id"]];
  }
  res.render("urls_login", templateVars);
});


//--------------get/post_wall_DO_NOT_CROSS😤👺-------------------//


app.post("/urls", (req, res) => {
  if (!(req.session && req.session["user_id"])) {
    res.status(403);
    res.end("403: Error, thou shall login!");
    return;
  }
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userid: req.session["user_id"] };
  res.redirect(`urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userid === req.session["user_id"]) {
    delete urlDatabase[req.params.shortURL].longURL;
    res.redirect("/urls/");
    return;
  } else {
    res.status(403);
    res.end("403: Error, you don't have permission to delete items not pertaining to your account!");
    return;
  }
});

app.post("/urls/:shortURL/update", (req, res) => {
  if (urlDatabase[req.params.shortURL].userid === req.session["user_id"]) {
    urlDatabase[req.params.shortURL].longURL = req.body.updatedURL;
    res.redirect("/urls/");
    return;
  } else {
    res.status(403);
    res.end("403: Error, you don't have permission to modify items not pertaining to your account!");
    return;
  }
});

app.post("/login", (req, res) => {
  const emailValue = req.body.email;
  const passwordValue = req.body.password;
  if (!emailAlreadyInUse(users, emailValue)) {
    console.log("Email value", emailValue);
    res.status(403);
    res.end("403: Error, email could not be located!");
    return;
  }
  const user = findUserViaEmail(users, emailValue);
  if (user) {
    if (!bcrypt.compareSync(passwordValue, user.password)) {
      console.log(user.password);
      console.log(passwordValue);
      res.status(403);
      res.end("403: Error, password is invalid.");
      return;
    }
    req.session['user_id'] = user.id;
    res.redirect("/urls/");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
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
  if (emailAlreadyInUse(users, emailValue)) {
    console.log(emailValue);
    console.log(req.body.email);
    console.log(users[user].email);
    res.status(400);
    res.end("400: Error, email already in use!");
    return;
  }
  const id  = generateRandomString();
  const user = {
    id: id,
    email: emailValue,
    password: bcrypt.hashSync(passwordValue, salt),
  };
  users[id] = user;
  req.session['user_id']  = id;
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});