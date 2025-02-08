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

const ChatWindowGet = ({ isOpen, toggleChatWindow, user, chatId }) => {
  const socketRef = useRef();
  const chatWindowRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem('userId');

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

      fetchMessages(chatId);

      socketRef.current.on('receive_message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleChatWindow, chatId]);

  const sendMessage = (event) => {
    event.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
      const messageData = {
        senderId: userId,
        message,
      };

      socketRef.current.emit('send_message', messageData, (error) => {
        if (error) {
          console.error('Error sending message:', error);
        } else {
          setMessages(prevMessages => [...prevMessages, messageData]);
        }
      });

      messageInput.value = '';
    } else {
      console.error('Message cannot be empty');
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
              className={`message ${message.senderId === userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p className="message-text">
                  <strong>{message.senderId === userId ? 'You' : `${user?.firstName || 'User'} ${user?.lastName || ''}`}:</strong> {message.message}
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

export default ChatWindowGet;
