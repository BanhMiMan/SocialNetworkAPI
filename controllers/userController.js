const { User, Thought } = require('../models');

const userController = {

  getUsers(req, res) {
  User
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
   User
   .findOne({ _id: req.params.id })
   .then((user) => !user ? res.status(404).json({ message: 'User ID not found' }) : res.json(user))
   .catch((err) => res.status(500).json(err));
  },

  createUser(req, res) {
    User
    .create(req.body)
    .then((dbUserData)=> res.json(dbUserData))
    .catch((err) => res.status(500).json(err));
  },
  
// update user by id
updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.id }, // Find user by ID
    { $set: req.body },     // Update with data from request body
    { runValidators: true, new: true } // Apply validators and return updated user
    )
    .then((user) => {
      !user ? res.status(404).json({ message: 'User ID not found' }) : res.json(user); // Return the updated user
    })
    .catch((err) => res.status(500).json(err)); // Handle errors
},

deleteUser(req, res) {
  // Find and delete the user by ID
  User.findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        // If no user with the provided ID was found
        return res.status(404).json({ message: 'User ID not found' });
      }

      // Delete associated thoughts using the $in operator
      return Thought.deleteMany({
        _id: {
          $in: user.thoughts
        }
      });
    })
    .then(() => {
      // Success: User and associated thoughts have been deleted
      res.json({ message: 'User and associated thoughts deleted!' });
    })
    .catch((err) => {
      // Error handling for any errors that occurred during the process
      res.status(500).json(err);
    });
},

// addFriend
addFriend(req, res) {
  console.log('Friend Added!');
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.params.id }, // Find user by ID
    { $addToSet: { friends: req.params.friendsId }}, // Add the friend's ID to the friends array
    { runValidators: true, new: true } // Apply validators and return updated user
  )
    .then((user) =>
      !user ? res.status(404).json({ message: 'User ID not found' }) : res.json(user)) // Return the updated user
      .catch((err) => res.status(500).json(err));  // Handle errors
},

 // removeFriend
removeFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.id }, // Find user by ID
    { $pull: { friends: req.params.friendsId }}, // Remove the friend's ID from the friends array
    { runValidators: true, new: true } // Apply validators and return updated user
  )
    .then((user) => 
      !user ? res.status(404).json({ message: 'User ID not found' }) : res.json(user)) // Return the updated user
      .catch((err) => res.status(500).json(err)); // Handle errors
}
}