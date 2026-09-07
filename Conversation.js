const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: String,
  conversationId: String,
  senderId: String,
  senderName: String,
  senderRole: String,
  text: String,
  createdAt: String
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: String,
  studentName: String,
  companyId: String,
  companyName: String,
  subject: String,
  status: String,
  lastMessage: String,
  lastMessageAt: String,
  createdAt: String,
  blockedBy: String,
  messages: [messageSchema]
});

module.exports = mongoose.model('Conversation', conversationSchema);