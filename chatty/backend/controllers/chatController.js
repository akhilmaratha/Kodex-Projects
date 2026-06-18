const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const populateChat = (query) =>
  query.populate('users', '-password').populate('groupAdmin', '-password');

const isGroupAdmin = (chat, userId) =>
  chat.groupAdmin && chat.groupAdmin.toString() === userId.toString();

const isChatMember = (chat, userId) =>
  chat.users.some((user) => user.toString() === userId.toString());

const parseUserIds = (users) => {
  const parsedUsers = typeof users === 'string' ? JSON.parse(users) : users;

  if (!Array.isArray(parsedUsers)) {
    return null;
  }

  return [...new Set(parsedUsers.map((id) => id?.toString()).filter(Boolean))];
};

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId || !isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Valid userId is required' });
  }

  const targetUser = await User.findById(userId);

  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    let results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name?.trim()) {
    return res.status(400).send({ message: 'Please Fill all the fields' });
  }

  let users;

  try {
    users = parseUserIds(req.body.users);
  } catch (error) {
    return res.status(400).send({ message: 'Users must be valid JSON' });
  }

  if (!users || users.some((id) => !isValidObjectId(id))) {
    return res.status(400).send({ message: 'Users must be valid user ids' });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: 'More than 2 users are required to form a group chat' });
  }

  const existingUsersCount = await User.countDocuments({ _id: { $in: users } });

  if (existingUsersCount !== users.length) {
    return res.status(400).send({ message: 'One or more users do not exist' });
  }

  users = [...new Set([...users, req.user._id.toString()])];

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name.trim(),
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await populateChat(Chat.findOne({ _id: groupChat._id }));

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !isValidObjectId(chatId) || !chatName?.trim()) {
    return res.status(400).json({ message: 'Valid chatId and chatName are required' });
  }

  const chat = await Chat.findById(chatId);

  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({ message: 'Group chat not found' });
  }

  if (!isGroupAdmin(chat, req.user._id)) {
    return res.status(403).json({ message: 'Only group admins can rename the group' });
  }

  const updatedChat = await populateChat(
    Chat.findByIdAndUpdate(chatId, { chatName: chatName.trim() }, { new: true })
  );

  if (!updatedChat) {
    res.status(404).json({ message: 'Chat Not Found' });
  } else {
    res.json(updatedChat);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId || !isValidObjectId(chatId) || !isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Valid chatId and userId are required' });
  }

  const chat = await Chat.findById(chatId);

  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({ message: 'Group chat not found' });
  }

  const isLeavingSelf = userId.toString() === req.user._id.toString();

  if (!isLeavingSelf && !isGroupAdmin(chat, req.user._id)) {
    return res.status(403).json({ message: 'Only group admins can remove members' });
  }

  if (!isChatMember(chat, userId)) {
    return res.status(400).json({ message: 'User is not in the group' });
  }

  const removed = await populateChat(Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  ));

  if (!removed) {
    res.status(404).json({ message: 'Chat Not Found' });
  } else {
    res.json(removed);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId || !isValidObjectId(chatId) || !isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Valid chatId and userId are required' });
  }

  const chat = await Chat.findById(chatId);

  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({ message: 'Group chat not found' });
  }

  if (!isGroupAdmin(chat, req.user._id)) {
    return res.status(403).json({ message: 'Only group admins can add members' });
  }

  if (isChatMember(chat, userId)) {
    return res.status(400).json({ message: 'User is already in the group' });
  }

  const userToAdd = await User.findById(userId);

  if (!userToAdd) {
    return res.status(404).json({ message: 'User not found' });
  }

  const added = await populateChat(Chat.findByIdAndUpdate(
    chatId,
    { $addToSet: { users: userId } },
    { new: true }
  ));

  if (!added) {
    res.status(404).json({ message: 'Chat Not Found' });
  } else {
    res.json(added);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
