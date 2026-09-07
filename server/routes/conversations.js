const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

router.get('/user/:userId', async (req, res) => {
  const all = await Conversation.find({
    $or: [{ studentId: req.params.userId }, { companyId: req.params.userId }]
  });
  res.json(all);
});

router.get('/:id', async (req, res) => {
  const conv = await Conversation.findOne({ id: req.params.id });
  res.json(conv);
});

router.post('/message', async (req, res) => {
  const { conversationId, sender, recipient, text, subject } = req.body;
  let conv = await Conversation.findOne({ id: conversationId });
  const isStudentSender = sender.role === 'student_researcher';

  const newMsg = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    conversationId,
    senderId: sender.id,
    senderName: sender.name,
    senderRole: sender.role,
    text,
    createdAt: new Date().toISOString()
  };

  if (!conv) {
    conv = await Conversation.create({
      id: conversationId,
      studentId: isStudentSender ? sender.id : recipient.id,
      studentName: isStudentSender ? sender.name : recipient.name,
      companyId: isStudentSender ? recipient.id : sender.id,
      companyName: isStudentSender ? recipient.name : sender.name,
      subject: subject || 'Agri Research Collaboration',
      status: isStudentSender ? 'pending_company_reply' : 'pending_student_reply',
      lastMessage: text,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      messages: [newMsg]
    });
    return res.json({ success: true, conversation: conv });
  }

  if (conv.status === 'blocked') {
    return res.json({ success: false, error: 'This conversation has been blocked.' });
  }
  if (conv.status === 'pending_company_reply' && isStudentSender) {
    return res.json({ success: false, error: 'To prevent spam, you cannot send another message until the company replies.' });
  }
  if (conv.status === 'pending_student_reply' && !isStudentSender) {
    return res.json({ success: false, error: 'To prevent spam, you cannot send another message until the researcher replies.' });
  }

  conv.messages.push(newMsg);
  conv.lastMessage = text;
  conv.lastMessageAt = new Date().toISOString();
  conv.status = 'active';
  await conv.save();

  res.json({ success: true, conversation: conv });
});

router.post('/:id/block', async (req, res) => {
  const { blockerUserId } = req.body;
  const conv = await Conversation.findOneAndUpdate(
    { id: req.params.id },
    { status: 'blocked', blockedBy: blockerUserId },
    { new: true }
  );
  res.json(conv);
});

module.exports = router;