import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ChatWindowGet from './ChatWindowGet';

const VITE_API_GET_USER = import.meta.env.VITE_API_GET_USER;

const ChatList = ({ isOpen, toggleChatList, chats, userId1, userId2, token, requesterId }) => {
  const chatListRef = useRef(null);
  const socket = io(import.meta.env.VITE_API_SOCKET);
  const [activeChat, setActiveChat] = useState(null);
  const [chatList, setChatList] = useState(chats);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(`${VITE_API_GET_USER}/${userId}?token=${token}&requesterId=${requesterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const user = await response.json();
      const userName = `${user.firstName} ${user.lastName}`;
      console.log('Fetched user name:', userName); // Debug log
      return userName;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return 'Unknown User';
    }
  };

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
    const fetchChatUserNames = async () => {
      const updatedChats = await Promise.all(chats.map(async (chat) => {
        const userId = chat.userId2 === userId1 ? chat.userId1 : chat.userId2;
        if (userId) {
          const userName = await fetchUserName(userId);
          console.log('User name for chat:', userName); // Debug log
          return { ...chat, userName };
        }
        return chat;
      }));
      setChatList(updatedChats);
    };

    fetchChatUserNames();
  }, [chats]);

  useEffect(() => {
    console.log('ChatList component rendered with chats:', chatList); // Debug log
  }, [chatList]);

  const openChatWindow = async (chatId, userId2) => {
    console.log('Chat ID clicked:', chatId); // Debug log

    if (!chatId) {
      const chatStartData = { userId1, userId2, token, requesterId };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_START_CHAT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(chatStartData)
        });

        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message) });
        }

        const data = await response.json();
        chatId = data.chatId;
      } catch (error) {
        console.error('Error starting chat:', error);
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_FETCH_MESSAGES}/${chatId}/messages`);
      const messages = await response.json();
      const userName = await fetchUserName(userId1 === requesterId ? userId2 : userId1);
      setActiveChat({ chatId, messages });
      setActiveUser(userName);
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
          <li key={index} className="mb-2 hover:text-gold cursor-pointer" onClick={() => openChatWindow(chat._id, chat.userId2)}>
            {chat.userName || 'Unknown User'}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
        onClick={toggleChatList}
      >
        Close
      </button>
      {activeChat && (
        <ChatWindowGet
          isOpen={isChatOpen}
          toggleChatWindow={() => setIsChatOpen(false)}
          chatId={activeChat.chatId}
          messages={activeChat.messages}
          userId1={userId1}
          userId2={userId2}
          token={token}
          requesterId={requesterId}
          user={activeUser}
        />
      )}
    </div>
  );
};

export default ChatList;