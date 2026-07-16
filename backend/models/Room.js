const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  socketId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  answers: {
    type: Array,
    default: []
  },
  accuracy: {
    type: Number,
    default: 100
  },
  avgSpeed: {
    type: Number,
    default: 0
  },
  isMock: {
    type: Boolean,
    default: false
  }
});

const RoomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting'
  },
  participants: [ParticipantSchema],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);
