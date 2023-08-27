const { Schema, model, Types } = require('mongoose');
const dateFormat = require("../utils/dateFormat");

// Schema to create Post model
const thoughtSchema = new Schema(
  {
    throughText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (reactionTimestamp) => dateFormat (reactionTimestamp)
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters : true,
    },
    id: false,
  }
);

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (reactionTimestamp) => dateFormat (reactionTimestamp)
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters : true,
    },
    id: false,
  }
)






// Create a virtual property `getTags` that gets the length of the thought's `reactions`
thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

// Initialize our Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
