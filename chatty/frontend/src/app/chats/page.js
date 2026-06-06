'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

export default function Chats() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Group Chat Modal States
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupSearch, setGroupSearch] = useState('');
  const [groupSearchResult, setGroupSearchResult] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (!socket) {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
      }
      
      const onConnected = () => setSocketConnected(true);
      const onTyping = () => setIsTyping(true);
      const onStopTyping = () => setIsTyping(false);
      
      const messageHandler = (newMessageRecieved) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          // Notify
        } else {
          setMessages((prev) => {
            if (prev.some((m) => m._id === newMessageRecieved._id)) return prev;
            return [...prev, newMessageRecieved];
          });
        }
      };

      socket.on('connected', onConnected);
      socket.on('typing', onTyping);
      socket.on('stop typing', onStopTyping);
      socket.on('message recieved', messageHandler);

      return () => {
        socket.off('connected', onConnected);
        socket.off('typing', onTyping);
        socket.off('stop typing', onStopTyping);
        socket.off('message recieved', messageHandler);
      };
    }
  }, [user]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    selectedChatCompare = selectedChat;
    if (selectedChat) {
      fetchMessages();
      socket.emit('join chat', selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    router.push('/login');
  };

  const handleSearch = async (query, isGroup = false) => {
    if (!query) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users?search=${query}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (isGroup) setGroupSearchResult(data);
      else setSearchResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChats = async () => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:5000/api/chats', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      const res = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const res = await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        const data = await res.json();
        setNewMessage('');
        setMessages([...messages, data]);
        socket.emit('new message', data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleGroupAdd = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) return;
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDeleteUser = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
  };

  const handleSubmitGroup = async () => {
    if (!groupChatName || !selectedUsers) return;
    try {
      const res = await fetch('http://localhost:5000/api/chats/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        }),
      });
      const data = await res.json();
      setChats([data, ...chats]);
      setShowGroupModal(false);
      setSelectedUsers([]);
      setGroupChatName('');
    } catch (error) {
      console.error(error);
    }
  };

  const getSenderName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 p-4 border-b border-gray-700 shadow-md z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Chatty
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 font-medium">Welcome, {user?.name}</span>
          <button
            onClick={logoutHandler}
            className="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-700 bg-gray-800/50 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Your Chats</h3>
            <button
              onClick={() => setShowGroupModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm shadow-blue-500/20"
            >
              + New Group
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <button
                onClick={() => handleSearch(search)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Go
              </button>
            </div>
            {/* Search Results */}
            {searchResult.length > 0 && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {searchResult.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => {
                      accessChat(u._id);
                      setSearchResult([]);
                      setSearch('');
                    }}
                    className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <p className="font-semibold text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chats List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedChat?._id === chat._id
                    ? 'bg-blue-600 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-700/40 hover:bg-gray-700/80 border border-transparent hover:border-gray-600'
                }`}
              >
                <p className="font-semibold text-sm">
                  {!chat.isGroupChat
                    ? getSenderName(user, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs text-gray-300 mt-1 truncate">
                    <span className="font-medium text-gray-200">
                      {chat.latestMessage.sender.name}:
                    </span>{' '}
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col bg-gray-900 relative">
          {selectedChat ? (
            <>
              <div className="p-5 border-b border-gray-800 bg-gray-800/80 backdrop-blur-md shadow-sm z-10 flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {!selectedChat.isGroupChat
                    ? getSenderName(user, selectedChat.users)
                    : selectedChat.chatName.toUpperCase()}
                </h2>
                {selectedChat.isGroupChat && (
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-md">Group Chat</span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-900 to-gray-800">
                {messages.map((m, i) => (
                  <div
                    key={m._id}
                    className={`flex flex-col ${m.sender._id === user._id ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[75%]">
                      {m.sender._id !== user._id && selectedChat.isGroupChat && (
                         <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold shadow-sm mb-1">
                           {m.sender.name[0].toUpperCase()}
                         </div>
                      )}
                      <div
                        className={`px-5 py-3 shadow-md ${
                          m.sender._id === user._id
                            ? 'bg-blue-600 rounded-2xl rounded-br-sm'
                            : 'bg-gray-700 rounded-2xl rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{m.content}</p>
                        <span className="text-[10px] text-gray-300/60 mt-1.5 block text-right">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                {isTyping && (
                  <div className="mb-2 ml-2">
                    <span className="text-xs text-blue-400 font-medium animate-pulse">Someone is typing...</span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type a message and press Enter..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                  className="w-full bg-gray-700/80 rounded-xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow shadow-inner"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="text-center p-8 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-2xl font-bold text-gray-200">Select a chat to start messaging</h2>
                <p className="text-gray-400 mt-2 text-sm">Or search for a user to start a new conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Create Group Chat</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Chat Name"
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Add Users (e.g. John, Jane)"
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSearch(e.target.value, true)}
              />
              {/* Selected Users */}
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((u) => (
                  <span
                    key={u._id}
                    className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {u.name}
                    <button onClick={() => handleDeleteUser(u)} className="hover:text-red-400">&times;</button>
                  </span>
                ))}
              </div>
              {/* Search Results */}
              {groupSearchResult.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {groupSearchResult.slice(0, 4).map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleGroupAdd(u)}
                      className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded cursor-pointer text-sm"
                    >
                      {u.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowGroupModal(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGroup}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
