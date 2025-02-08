import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import ChatList from './ChatList';
import io from 'socket.io-client';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const chatListRef = useRef(null);
  const socketRef = useRef(null);

  const toggleChatList = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:4000');
    }

    const handleClickOutside = (event) => {
      if (chatListRef.current && !chatListRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const fetchChats = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`http://localhost:4000/api/chat/user/${userId}`);
        const data = await response.json();
        console.log('Chats fetched from API:', data); // Debug log
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      fetchChats();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (socketRef.current) {
        socketRef.current.off('active_chats');
      }
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={toggleChatList}
      >
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
      </button>
      {isOpen && (
        <div ref={chatListRef}>
          <ChatList isOpen={isOpen} toggleChatList={toggleChatList} chats={chats} />
        </div>
      )}
    </>
  );
};

export default FloatingButton;