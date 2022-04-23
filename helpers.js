const emailAlreadyInUse = (users, newEmail) => {
  for (const user in users) {
    if (users[user].email === newEmail) {
      return true;
    }
  }
  return false;
};

const generateRandomString = () => {
  return Buffer.from(Math.random().toString()).toString("base64").substr(10, 6);
};

const findUserViaEmail = (users, email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};

const urlsForUser = (urlDatabase, userid) => {
  const accountURLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userid === userid) {
      accountURLs[url] = urlDatabase[url];
    }
  }
  return accountURLs;
};

module.exports = { emailAlreadyInUse, generateRandomString, findUserViaEmail, urlsForUser };

// ES Import from Syntax


