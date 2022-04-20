const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

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
}

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: "",
    urls: urlDatabase };
    if (req.cookies && req.cookies["username"]) {
      templateVars.username = req.cookies["username"];
    }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: ""};
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, username:'', longURL: urlDatabase[req.params.shortURL] };
  if (req.cookies && req.cookies["username"]) {
    templateVars.username = req.cookies["username"];
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
  const templateVars = { username: "" };
    if (req.cookies && req.cookies["username"]) {
      templateVars.username = req.cookies["username"];
    }
  res.render("urls_registration", templateVars);
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
  // console.log("REQ", req);
  urlDatabase[req.params.shortURL] = req.body.updatedURL;
  res.redirect("/urls/"); 
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls/"); 
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls/"); 
});

app.post("/register", (req, res) => {
  console.log(req);
  const id  = generateRandomString(); 
  user = { 
    id: id,
    email: req.body.email,
    password: req.body.password
  }
  users[id] = user;
  res.cookie("user_id", id);
  console.log(users);
  res.redirect(`/urls`);
});




function generateRandomString() {
  return Buffer.from(Math.random().toString()).toString("base64").substr(10, 6);
}



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});