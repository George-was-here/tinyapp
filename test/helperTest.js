const { assert } = require('chai');

const { emailAlreadyInUse } = require('../helpers.js');

const testUsers = {
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

describe('emailAlreadyInUse', function() {
  it('should return a user with valid email', function() {
    const user = emailAlreadyInUse("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    "userRandomID should equivalate to user@example.com email"
  });
});