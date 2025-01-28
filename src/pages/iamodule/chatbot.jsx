import React, { useState } from "react";
import { Input, Button, Typography, Card, CardBody } from "@material-tailwind/react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User ID or token is missing");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_CHATBOT}?userId=${userId}&token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data) {
        setChatHistory([...chatHistory, { userMessage: message, botMessage: data.botMessage }]);
        setMessage("");
      } else {
        console.error("Failed to send message:", data ? data.message : "No response data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="flex-1 flex flex-col">
      <Typography variant="h2" className="font-bold mb-4">ChatBot</Typography>
      <Card className="flex-1 p-4 shadow-lg flex flex-col">
        <CardBody className="flex-1 flex flex-col">
          <div className="chat-history flex-1 max-h-full overflow-y-auto mb-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="mb-4 flex flex-col">
                <div className="self-end bg-blue-500 text-white p-2 rounded-lg mb-1 max-w-xs">
                  <Typography variant="small" className="font-bold">
                    <strong>Tú:</strong> {chat.userMessage}
                  </Typography>
                </div>
                <div className="self-start bg-gray-200 text-black p-2 rounded-lg max-w-xs">
                  <Typography variant="small" className="font-bold">
                    <strong>Bot:</strong> {chat.botMessage.replace(/^bot:\s*/, '')}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button onClick={handleSendMessage}>Enviar</Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
};

export default Chatbot;
export { Chatbot };
