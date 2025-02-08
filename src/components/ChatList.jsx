import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ChatWindowGet from './ChatWindowGet';

const ChatList = ({ isOpen, toggleChatList, chats }) => {
  const chatListRef = useRef(null);
  const socket = io('http://localhost:4000');
  const [activeChat, setActiveChat] = useState(null);
  const [chatList, setChatList] = useState(chats);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatListRef.current && !chatListRef.current.contains(event.target)) {
        toggleChatList();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleChatList]);

  useEffect(() => {
    socket.on('new_conversation', (newChat) => {
      console.log('New conversation received:', newChat); // Debug log
      setChatList((prevChats) => [...prevChats, newChat]);
    });

    socket.on('active_chats', (activeChats) => {
      console.log('Active chats received in ChatList:', activeChats); // Debug log
      setChatList(activeChats);
    });

    return () => {
      socket.off('new_conversation');
      socket.off('active_chats');
    };
  }, [socket]);

  useEffect(() => {
    setChatList(chats);
  }, [chats]);

  useEffect(() => {
    console.log('ChatList component rendered with chats:', chatList); // Debug log
  }, [chatList]);

  const openChatWindow = async (chatId) => {
    console.log('Chat ID clicked:', chatId); // Debug log
    try {
      const response = await fetch(`http://localhost:4000/api/chat/${chatId}/messages`);
      const messages = await response.json();
      setActiveChat({ chatId, messages });
      setIsChatOpen(true); // Open the chat window
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleNewConversation = (newChat) => {
    setChatList((prevChats) => [...prevChats, newChat]);
  };

  if (!isOpen) return null;

  return (
    <div ref={chatListRef} className="fixed bottom-16 right-4 w-80 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <ul>
        {chatList.map((chat, index) => (
          <li key={index} className="mb-2 hover:text-gold cursor-pointer" onClick={() => openChatWindow(chat._id)}>
            Chat ID: {chat._id}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
        onClick={toggleChatList}
      >
        Close
      </button>
      {activeChat && <ChatWindowGet isOpen={isChatOpen} toggleChatWindow={() => setIsChatOpen(false)} chatId={activeChat.chatId} messages={activeChat.messages} />}
    </div>
  );
};

export default ChatList;