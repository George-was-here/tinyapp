const emailAlreadyInUse = (users, newEmail) => {
  for (const user in users) {
    if (users[user].email === newEmail) {
      return true;
    }
  }
  return false;
};

module.exports = emailAlreadyInUse;

// const emailAlreadyInUse = (newEmail) => {
//   for (const user in users) {
//     if (users[user].email === newEmail) {
//       return true;
//     }
//   }
//   return false;
// };