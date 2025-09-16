import React, { useState } from "react";

export default function ChatBox({ messages, onSend }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl flex flex-col p-4 h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-2">
        <input
          className="flex-1 border rounded-lg p-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Kirim
        </button>
      </form>
    </div>
  );
}
