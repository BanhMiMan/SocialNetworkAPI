const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    first: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thought"
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  ],
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `friendCount` that gets the length of the users 'friends' list
userSchema
 .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.legnth;
  })

// Initialize our User model
const User = model('User', userSchema);

module.exports = User;
