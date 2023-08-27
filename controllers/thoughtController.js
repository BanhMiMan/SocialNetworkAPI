const { Thought, User } = require('../models');

const thoughtController = {

  getThoughts(req, res) {
  Thought
    .find()
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));
  },

  getSingleThought({ params }, res) {
   Thought
   .findOne({ _id: params.id })
   .then((dbThoughtData) => !dbThoughtData ? res.status(404).json({ message: "Thought's ID not found" }) : res.json(dbThoughtData))
   .catch((err) => { console.log(err);
    res.status(500).json(err);
  });
  },

  createThought(req, res) {
    Thought
    .create(req.body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId},
        { $push: { thoughts: dbThoughtData._id}},
        { new: true }
      )
    })
    .then(userData => res.json(userData))
    .catch((err) => res.status(500).json(err));
  },
  
// update thought by id
updateThought(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.id }, // Find user by ID
    { $set: req.body },     // Update with data from request body
    { runValidators: true, new: true } // Apply validators and return updated user
  )
    .then((thought) => { !thought ? res.status(404).json({message: "Thought's ID not found" }) : res.json(thought); // Return the updated user 
    })
    .catch((err) => res.status(500).json(err));  // Handle errors
},

deleteThought(req, res) {
  // Find and delete the thought by ID
  Thought.findOneAndDelete({ _id: req.params.id })
    .then((thought) => {
      if (!thought) {
        // If no thought with the provided ID was found
        return res.status(404).json({ message: "Thought's ID not found" });
      }
      // Remove the thought's reference from the associated user's thoughts array
      return User.findOneAndUpdate(
        {_id:req.body.userID},
        {$pull:{thoughts:thought._id}},
        {new:true});
    })
    // Success: Thought and associated reactions have been deleted
    .then(() => { res.json({ message: 'Thought and associated reactions deleted!' });
     }) 
    // Error handling for any errors that occurred during the process
    .catch((err) => { res.status(500).json(err);
     });
},

// addReaction
addReaction(req, res) {
  console.log('Reaction added!');
  console.log(req.body);
  Thought.findOneAndUpdate(
    { _id: req.params.id }, // Find reaction by ID
    { $addToSet: { friends: req.params.friendsId }}, // Add the friend's ID to the friends array
    { runValidators: true, new: true } // Apply validators and return updated user
  )
    .then((thought) => {
      if (!thought) {
        return res.status(404).json({ message: "Thought's ID not found" });
      }
      res.json(thought); // Return the updated user
    })
    .catch((err) => res.status(500).json(err)); // Handle errors
},

 // removeReaction
removeReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.id }, // Find user by ID
    { $pull: { reactions: req.params.reactionId }}, // Remove the reaction's ID from the reactions array
    { runValidators: true, new: true } // Apply validators and return updated reaction
  )
    .then((thought) => {
      !thought ? res
          .status(404)
          .json({ message: "Thought's ID not found" }): res.json(thought) // Return the updated reaction
    })
    .catch((err) => res.status(500).json(err)); // Handle errors
}
}