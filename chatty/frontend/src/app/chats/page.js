'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupSearchResult, setGroupSearchResult] = useState([]);

  // Group settings modal state
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [renameGroupInput, setRenameGroupInput] = useState('');
  const [addMemberSearchResult, setAddMemberSearchResult] = useState([]);

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
          // Notify and update chat list
          setChats((prev) => {
            const chatExists = prev.find((c) => c._id === newMessageRecieved.chat._id);
            if (!chatExists) {
              return [newMessageRecieved.chat, ...prev];
            } else {
              return [newMessageRecieved.chat, ...prev.filter(c => c._id !== newMessageRecieved.chat._id)];
            }
          });
        } else {
          setMessages((prev) => {
            if (prev.some((m) => m._id === newMessageRecieved._id)) return prev;
            return [...prev, newMessageRecieved];
          });
          // Update the latest message in the sidebar for the active chat as well
          setChats((prev) => {
             return [newMessageRecieved.chat, ...prev.filter(c => c._id !== newMessageRecieved.chat._id)];
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
      setRenameGroupInput(selectedChat.chatName);
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

  const handleSearch = async (query, type = 'user') => {
    if (!query) {
      if (type === 'group') setGroupSearchResult([]);
      else if (type === 'addMember') setAddMemberSearchResult([]);
      else setSearchResult([]);
      return;
    }
    try {
      const res = await fetch(`${ENDPOINT}/api/users?search=${query}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (type === 'group') setGroupSearchResult(data);
      else if (type === 'addMember') setAddMemberSearchResult(data);
      else setSearchResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${ENDPOINT}/api/chats`, {
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
      const res = await fetch(`${ENDPOINT}/api/chats`, {
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
      const res = await fetch(`${ENDPOINT}/api/messages/${selectedChat._id}`, {
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
        const res = await fetch(`${ENDPOINT}/api/messages`, {
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
      const res = await fetch(`${ENDPOINT}/api/chats/group`, {
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
      if (!res.ok) {
        alert(data.message || 'Failed to create group chat');
        return;
      }
      setChats([data, ...chats]);
      setShowGroupModal(false);
      setSelectedUsers([]);
      setGroupChatName('');
      setGroupSearchResult([]);
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleRenameGroup = async () => {
    if (!renameGroupInput) return;
    try {
      const res = await fetch(`${ENDPOINT}/api/chats/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          chatName: renameGroupInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to rename group');
        return;
      }
      setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromGroup = async (userToRemove) => {
    try {
      const res = await fetch(`${ENDPOINT}/api/chats/groupremove`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userToRemove._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to remove user');
        return;
      }
      userToRemove._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
      if (userToRemove._id === user._id) {
         fetchChats();
         setShowGroupSettings(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUserToGroup = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      alert('User is already in the group');
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      alert('Only admins can add users');
      return;
    }

    try {
      const res = await fetch(`${ENDPOINT}/api/chats/groupadd`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userToAdd._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to add user');
        return;
      }
      setSelectedChat(data);
      setChats(chats.map((c) => (c._id === data._id ? data : c)));
      setAddMemberSearchResult([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getSenderName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-900/80 backdrop-blur-lg p-4 border-b border-gray-800 shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400 tracking-tight">
            Chatty
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-1.5 border border-gray-700/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">{user?.name}</span>
          </div>
          <button
            onClick={logoutHandler}
            className="group relative px-4 py-2 text-sm font-semibold text-red-400 bg-red-400/10 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-[320px] lg:w-[380px] border-r border-gray-800 bg-gray-900/50 flex flex-col backdrop-blur-xl">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Messages</h3>
            <button
              onClick={() => setShowGroupModal(true)}
              className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs px-3 py-1.5 rounded-md font-semibold transition-all border border-indigo-500/20 hover:border-indigo-500/40"
            >
              + Group
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-800 bg-gray-900/30">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-gray-500 shadow-inner"
              />
            </div>
            {/* Search Results */}
            {searchResult.length > 0 && (
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-1">
                {searchResult.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => {
                      accessChat(u._id);
                      setSearchResult([]);
                      setSearch('');
                    }}
                    className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-xl cursor-pointer hover:bg-indigo-500/10 hover:border hover:border-indigo-500/30 border border-transparent transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-bold text-sm shadow-md">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-200 truncate group-hover:text-indigo-300 transition-colors">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chats List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {chats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const chatName = !chat.isGroupChat ? getSenderName(user, chat.users) : chat.chatName;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.15)]'
                      : 'bg-transparent border-transparent hover:bg-gray-800/40 hover:border-gray-700/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0 ${
                    chat.isGroupChat 
                      ? 'bg-linear-to-tr from-gray-700 to-gray-600 text-white border border-gray-600' 
                      : 'bg-linear-to-tr from-blue-500 to-indigo-600 text-white'
                  }`}>
                    {chat.isGroupChat ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    ) : (
                      chatName[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isSelected ? 'text-indigo-300' : 'text-gray-200'}`}>
                      {chatName}
                    </p>
                    {chat.latestMessage && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        <span className={`${isSelected ? 'text-indigo-400' : 'text-gray-400'} font-medium`}>
                          {chat.latestMessage.sender._id === user._id ? 'You' : chat.latestMessage.sender.name}:
                        </span>{' '}
                        {chat.latestMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col bg-gray-900/50 relative">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 px-6 border-b border-gray-800 bg-gray-900/90 backdrop-blur-xl shadow-sm z-10 flex justify-between items-center sticky top-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md shrink-0 ${
                    selectedChat.isGroupChat 
                      ? 'bg-gray-800 border border-gray-700 text-gray-300' 
                      : 'bg-linear-to-tr from-blue-500 to-indigo-600 text-white'
                  }`}>
                     {selectedChat.isGroupChat ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    ) : (
                      getSenderName(user, selectedChat.users)[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100 tracking-tight">
                      {!selectedChat.isGroupChat
                        ? getSenderName(user, selectedChat.users)
                        : selectedChat.chatName.toUpperCase()}
                    </h2>
                    {selectedChat.isGroupChat && (
                      <p className="text-xs text-gray-500 font-medium">{selectedChat.users.length} members</p>
                    )}
                  </div>
                </div>
                
                {selectedChat.isGroupChat && (
                  <button
                    onClick={() => setShowGroupSettings(true)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m, i) => {
                  const isMe = m.sender._id === user._id;
                  const showAvatar = !isMe && selectedChat.isGroupChat && (i === 0 || messages[i-1].sender._id !== m.sender._id);
                  
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-[fadeIn_0.3s_ease-out]`}
                    >
                      <div className={`flex items-end gap-2.5 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {(!isMe && selectedChat.isGroupChat) && (
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md shrink-0 ${showAvatar ? 'bg-linear-to-br from-indigo-400 to-purple-500 text-white' : 'bg-transparent text-transparent'}`}>
                             {showAvatar ? m.sender.name[0].toUpperCase() : ''}
                           </div>
                        )}
                        <div className="flex flex-col">
                           {showAvatar && (
                             <span className="text-[11px] text-gray-400 ml-1 mb-1 font-medium">{m.sender.name}</span>
                           )}
                          <div
                            className={`px-5 py-3 shadow-sm ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm shadow-indigo-500/20'
                                : 'bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm border border-gray-700/50'
                            }`}
                          >
                            <p className="text-[15px] leading-relaxed wrap-break-word">{m.content}</p>
                          </div>
                          <span className={`text-[10px] text-gray-500 mt-1.5 font-medium ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-5 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800">
                {isTyping && (
                  <div className="mb-3 flex items-center gap-2">
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                    <span className="text-xs text-indigo-400/80 font-medium">Someone is typing...</span>
                  </div>
                )}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={typingHandler}
                    onKeyDown={sendMessage}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-6 pr-14 py-4 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all shadow-inner"
                  />
                  <button
                    onClick={() => sendMessage({ key: 'Enter' })}
                    className={`absolute right-3 p-2 rounded-xl flex items-center justify-center transition-all ${
                      newMessage.trim() ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-500' : 'bg-transparent text-gray-500'
                    }`}
                  >
                    <svg className="w-5 h-5 translate-x-px -translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="w-24 h-24 mb-6 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700/50 shadow-inner">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-300 tracking-tight">Your Messages</h2>
              <p className="text-gray-500 mt-2 text-[15px]">Select a chat to start messaging or create a new group.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
          <div className="bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden transform scale-100 transition-transform">
            <div className="p-6 border-b border-gray-800 bg-gray-800/30">
               <h2 className="text-xl font-bold text-gray-100">Create Group Chat</h2>
               <p className="text-xs text-gray-400 mt-1">Add at least 2 other members</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Group Name</label>
                 <input
                   type="text"
                   placeholder="E.g. Project Team"
                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                   value={groupChatName}
                   onChange={(e) => setGroupChatName(e.target.value)}
                 />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Add Members</label>
                 <input
                   type="text"
                   placeholder="Search users..."
                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                   onChange={(e) => handleSearch(e.target.value, 'group')}
                 />
              </div>
              
              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedUsers.map((u) => (
                    <span
                      key={u._id}
                      className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                    >
                      {u.name}
                      <button onClick={() => handleDeleteUser(u)} className="hover:text-red-400 hover:bg-red-500/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors">&times;</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {groupSearchResult.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-800/50 rounded-xl p-2 border border-gray-700/50">
                  {groupSearchResult.slice(0, 4).map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleGroupAdd(u)}
                      className="p-3 hover:bg-gray-700/80 rounded-lg cursor-pointer text-[15px] flex items-center gap-3 transition-colors"
                    >
                       <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold shrink-0">{u.name[0].toUpperCase()}</div>
                      {u.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-800/30 flex justify-end gap-3">
              <button
                onClick={() => {
                   setShowGroupModal(false);
                   setGroupChatName('');
                   setSelectedUsers([]);
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGroup}
                disabled={selectedUsers.length < 2 || !groupChatName}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/20 text-white"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Settings Modal */}
      {showGroupSettings && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
          <div className="bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 bg-gray-800/30 flex justify-between items-center sticky top-0">
               <h2 className="text-xl font-bold text-gray-100">{selectedChat.chatName}</h2>
               <button onClick={() => setShowGroupSettings(false)} className="text-gray-400 hover:text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              {/* Rename Group */}
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Rename Group</label>
                 <div className="flex gap-2">
                   <input
                     type="text"
                     className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                     value={renameGroupInput}
                     onChange={(e) => setRenameGroupInput(e.target.value)}
                   />
                   <button
                     onClick={handleRenameGroup}
                     className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-gray-200"
                   >
                     Update
                   </button>
                 </div>
              </div>

              {/* Members List */}
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                   Members ({selectedChat.users.length})
                 </label>
                 <div className="space-y-2">
                    {selectedChat.users.map((u) => (
                      <div key={u._id} className="flex justify-between items-center p-3 bg-gray-800/40 border border-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-200">{u._id === user._id ? 'You' : u.name}</p>
                            {selectedChat.groupAdmin._id === u._id && (
                              <p className="text-[10px] text-indigo-400 font-bold uppercase">Admin</p>
                            )}
                          </div>
                        </div>
                        {selectedChat.groupAdmin._id === user._id && u._id !== user._id && (
                          <button
                            onClick={() => handleRemoveFromGroup(u)}
                            className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 bg-red-400/10 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Add Member (Admin Only) */}
              {selectedChat.groupAdmin._id === user._id && (
                <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Add Member</label>
                   <input
                     type="text"
                     placeholder="Search to add..."
                     className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                     onChange={(e) => handleSearch(e.target.value, 'addMember')}
                   />
                   {addMemberSearchResult.length > 0 && (
                     <div className="mt-2 max-h-32 overflow-y-auto space-y-1 bg-gray-800/50 rounded-xl p-2 border border-gray-700/50">
                       {addMemberSearchResult.slice(0, 4).map((u) => (
                         <div
                           key={u._id}
                           onClick={() => handleAddUserToGroup(u)}
                           className="p-2 hover:bg-gray-700/80 rounded-lg cursor-pointer text-sm flex items-center justify-between transition-colors"
                         >
                           <span>{u.name}</span>
                           <span className="text-indigo-400 font-medium text-xs">Add +</span>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              )}
              
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-800/30 flex justify-center">
              <button
                onClick={() => handleRemoveFromGroup(user)}
                className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl text-sm font-semibold transition-all"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
