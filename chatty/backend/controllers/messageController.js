const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

const allMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const isMember = chat.users.some((userId) => userId.toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content?.trim() || !chatId) {
    return res.status(400).json({ message: 'Message content and chatId are required' });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const isMember = chat.users.some((userId) => userId.toString() === req.user._id.toString());

  if (!isMember) {
    return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
  }

  const newMessage = {
    sender: req.user._id,
    content: content.trim(),
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { allMessages, sendMessage };
