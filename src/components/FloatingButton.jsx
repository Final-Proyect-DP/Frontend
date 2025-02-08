import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import ChatList from './ChatList';
import io from 'socket.io-client';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const chatListRef = useRef(null);
  const socketRef = useRef(null);
  const [userId1, setUserId1] = useState(null);
  const [userId2, setUserId2] = useState(null);
  const [token, setToken] = useState(null);
  const [requesterId, setRequesterId] = useState(null);

  const toggleChatList = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    setUserId1(userId);
    setToken(token);
    setRequesterId(userId);
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_SOCKET);
    }

    const handleClickOutside = (event) => {
      if (chatListRef.current && !chatListRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const fetchChats = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_FETCH_CHATS}/${userId}`);
        const data = await response.json();
        console.log('Chats fetched from API:', data); // Debug log
        setChats(data);
        if (data.length > 0) {
          setUserId2(data[0].userId2); // Assuming userId2 is in the chat data
        }
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
          <ChatList
            isOpen={isOpen}
            toggleChatList={toggleChatList}
            chats={chats}
            userId1={userId1}
            userId2={userId2}
            token={token}
            requesterId={requesterId}
          />
        </div>
      )}
    </>
  );
};

export default FloatingButton;