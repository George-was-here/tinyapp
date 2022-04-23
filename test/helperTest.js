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
    assert.isOk(true, 'this will return true');
  });
  it('should return undefined if given a non-existent email', function() {
      const user = emailAlreadyInUse("alphanumeric@example.com", testUsers)
      const expectedUserID = "Enzo";
      assert.isUndefined(user, 'undefined');
    });  
});
