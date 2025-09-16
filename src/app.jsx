import React, { useState } from "react";
import ChatBox from "./Front-end/components/ChatBox";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo 👋, saya siap menjawab pertanyaan Anda!" },
  ]);

  const sendMessage = async (message) => {
    const newMessages = [...messages, { sender: "user", text: message }];
    setMessages(newMessages);

    try {
      const res = await fetch("http://localhost:8000/ask", {  // endpoint backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message }),
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.answer }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "❌ Error koneksi API" }]);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ChatBox messages={messages} onSend={sendMessage} />
    </div>
  );
}

export default App;
