'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConnected(true));

      socket.on('message recieved', (newMessageRecieved) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          // Notify
        } else {
          setMessages((prev) => [...prev, newMessageRecieved]);
        }
      });
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

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    router.push('/login');
  };

  const handleSearch = async () => {
    if (!search) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setSearchResult(data);
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

  const getSenderName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Chatty
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
          <button
            onClick={logoutHandler}
            className="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-700 bg-gray-800/50 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search users to chat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                    onClick={() => accessChat(u._id)}
                    className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-gray-300">{u.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chats List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Your Chats</h3>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedChat?._id === chat._id
                    ? 'bg-blue-600 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <p className="font-medium">
                  {!chat.isGroupChat
                    ? getSenderName(user, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs text-gray-300 mt-1 truncate">
                    {chat.latestMessage.sender.name}: {chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {selectedChat ? (
            <>
              <div className="p-6 border-b border-gray-800 bg-gray-800/30 backdrop-blur-sm">
                <h2 className="text-xl font-bold">
                  {!selectedChat.isGroupChat
                    ? getSenderName(user, selectedChat.users)
                    : selectedChat.chatName.toUpperCase()}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={m._id}
                    className={`flex ${m.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl ${
                        m.sender._id === user._id
                          ? 'bg-blue-600 rounded-br-sm'
                          : 'bg-gray-700 rounded-bl-sm'
                      }`}
                    >
                      <p>{m.content}</p>
                      <span className="text-[10px] text-gray-300/80 mt-1 block">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <input
                  type="text"
                  placeholder="Type a message and press Enter..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={sendMessage}
                  className="w-full bg-gray-700 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-gray-300">Select a chat to start messaging</h2>
                <p className="text-gray-500 mt-2">Or search for a user to start a new conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
