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

const ChatWindowGet = ({ isOpen, toggleChatWindow, user, chatId, userId1, userId2, token, requesterId }) => {
  const socketRef = useRef();
  const chatWindowRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_SOCKET, {
        query: { token }
      });
    }

    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && event.target.id !== 'messageInput') {
        toggleChatWindow();
      }
    };

    if (isOpen) {
      console.log('Chat window opened with userId1:', userId1, 'and userId2:', userId2); // Debug log
      document.addEventListener('mousedown', handleClickOutside);

      const fetchMessages = async (chatId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_FETCH_MESSAGES}/${chatId}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          console.log('Messages fetched from API:', data); // Debug log
          setMessages(data);
          // Scroll to the bottom of the chat window
          setTimeout(() => {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
          }, 100);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages(chatId);

      socketRef.current.on('receive_message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        // Scroll to the bottom of the chat window
        setTimeout(() => {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }, 100);
      });

      socketRef.current.on('send_message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        // Scroll to the bottom of the chat window
        setTimeout(() => {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }, 100);
      });

      socketRef.current.emit('join_chat', { chatId, userId });
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      socketRef.current.off('receive_message');
      socketRef.current.off('send_message');
    };
  }, [isOpen, toggleChatWindow, chatId, token, userId1, userId2]);

  const sendMessage = (event) => {
    event.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message && chatId && userId1 && userId2) {
      const messageData = {
        chatId,
        senderId: userId1,
        receiverId: userId2,
        message,
        timestamp: new Date().toISOString(), // Add timestamp
      };

      socketRef.current.emit('send_message', messageData, (error) => {
        if (error) {
          console.error('Error sending message:', error);
        } else {
          setMessages(prevMessages => [...prevMessages, messageData]);
          // Save the conversation to the chat list
          socketRef.current.emit('save_conversation', { chatId, userId1, userId2, user });
          // Scroll to the bottom of the chat window
          setTimeout(() => {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
          }, 100);
        }
      });

      messageInput.value = '';
    } else {
      console.error('Message cannot be empty, chatId, userId1, or userId2 is not defined');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
      sendMessage(event);
    }
  };

  if (!isOpen) return null;

  return (
    <MDBContainer fluid className="chat-container">
      <MDBCard className="chat-card">
        <MDBCardHeader className="chat-header">
          <h5 className="mb-0">{user ? `${user}'s product` : 'Chat'}</h5>
          <MDBBtn color="light" size="sm" rippleColor="dark" onClick={toggleChatWindow}>
            <MDBIcon fas icon="times" />
          </MDBBtn>
        </MDBCardHeader>
        <MDBCardBody className="chat-body" ref={chatWindowRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderId === userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p className="message-text">
                  <strong>{message.senderId === userId ? 'You' : `${user}`}:</strong> {message.message}
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