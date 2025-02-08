import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBBtn,
} from 'mdb-react-ui-kit';
import './ChatWindow.css'; // Import the CSS file

const ChatWindow = ({ isOpen, toggleChatWindow, user, userId2 }) => {
  const socketRef = useRef();
  const chatWindowRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const userId1 = localStorage.getItem('userId');

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:4000');
    }

    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        toggleChatWindow();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);

      const requesterId = userId1;
      const token = localStorage.getItem('token');
      const chatStartData = { userId1, userId2, token, requesterId };

      console.log('Sending chat start data:', chatStartData); // Debug log

      fetch('http://localhost:4000/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(chatStartData)
      })
      .then(response => {
        console.log('Server response:', response); // Debug log
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message) });
        }
        return response.json();
      })
      .then(data => {
        console.log('Chat start response data:', data); // Debug log
        const chatId = data.chatId;
        setChatId(chatId);
        socketRef.current.emit('join_chat', { chatId, userId: userId1 });

        fetchMessages(chatId);

        socketRef.current.on('receive_message', (message) => {
          setMessages(prevMessages => [...prevMessages, message]);
        });
      })
      .catch(error => console.error('Error starting chat:', error));
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleChatWindow, userId1, userId2]);

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/chat/${chatId}/messages`);
      const data = await response.json();
      console.log('Messages fetched from API:', data); // Debug log
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message && chatId) {
      const messageData = {
        chatId,
        senderId: userId1,
        receiverId: userId2,
        message,
      };

      socketRef.current.emit('send_message', messageData, (error) => {
        if (error) {
          console.error('Error sending message:', error);
        } else {
          setMessages(prevMessages => [...prevMessages, messageData]);
          // Save the conversation to the chat list
          socketRef.current.emit('save_conversation', { chatId, userId1, userId2, user });
        }
      });

      messageInput.value = '';
    } else {
      console.error('Message cannot be empty or chatId is not defined');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage(event);
    }
  };

  if (!isOpen) return null;

  return (
    <MDBContainer fluid className="chat-container">
      <MDBCard className="chat-card">
        <MDBCardHeader className="chat-header">
          <h5 className="mb-0">{user ? `Chat with ${user.firstName} ${user.lastName}` : 'Chat'}</h5>
          <MDBBtn color="light" size="sm" rippleColor="dark" onClick={toggleChatWindow}>
            <MDBIcon fas icon="times" />
          </MDBBtn>
        </MDBCardHeader>
        <MDBCardBody className="chat-body">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderId === userId1 ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p className="message-text">
                  <strong>{message.senderId === userId1 ? 'You' : `${user.firstName} ${user.lastName}`}:</strong> {message.message}
                </p>
                <p className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </MDBCardBody>
        <MDBCardFooter className="chat-footer">
          <form onSubmit={sendMessage} style={{ display: 'flex', width: '100%' }}>
            <input
              type="text"
              className="form-control form-control-lg"
              id="messageInput"
              placeholder="Type message"
              onKeyPress={handleKeyPress}
            />
            <MDBBtn type="submit" color="primary" size="sm">
              <MDBIcon fas icon="paper-plane" />
            </MDBBtn>
          </form>
        </MDBCardFooter>
      </MDBCard>
    </MDBContainer>
  );
};

export default ChatWindow;