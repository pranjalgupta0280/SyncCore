const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null means public team channel message; set ObjectId for 1-on-1 direct message
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String, // Base64 data URL or image URL
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true, // Indexed for chronological streaming
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
