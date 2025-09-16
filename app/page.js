"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatDashboard() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeUser, setActiveUser] = useState("Superman");
  const chatEndRef = useRef(null);

  const contacts = [
    { name: "Superman", preview: "Hello, I need help", email: "superman@gmail.com", phone: "(980) 444-9876", avatar: "🦸‍♂️" },
    { name: "Wonder Woman", preview: "Looking for a home", email: "wonderwoman@gmail.com", phone: "(980) 123-4567", avatar: "🦸‍♀️" },
    { name: "Black Widow", preview: "Can I talk to agent?", email: "blackwidow@gmail.com", phone: "(980) 765-4321", avatar: "🕷️" }
  ];

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      if (!res.ok) throw new Error("Request gagal");

      const data = await res.json();
      setChatHistory([...chatHistory, { question, answer: data.answer }]);
      setQuestion("");
    } catch (err) {
      console.error(err);
      setChatHistory([...chatHistory, { question, answer: "⚠️ Terjadi error saat request." }]);
      setQuestion("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const theme = {
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    bubbleUser: "#4f46e5",
    bubbleBot: "#2d2d2d",
    text: "#f5f5f5",
    inputBg: "rgba(18,18,18,0.8)",
    border: "#333",
    accent: "#6366f1"
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'Inter', sans-serif",
      background: theme.background,
      color: theme.text
    }}>
      {/* Sidebar Left */}
      <div style={{
        width: "260px",
        backdropFilter: "blur(8px)",
        background: theme.inputBg,
        borderRight: `1px solid ${theme.border}`,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ fontWeight: "600", fontSize: "20px" }}>Contacts</div>
        <input
          placeholder="🔍 Search..."
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            background: "#111",
            color: theme.text
          }}
        />
        {contacts.map((c, i) => (
          <div
            key={i}
            onClick={() => setActiveUser(c.name)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: activeUser === c.name ? "rgba(99,102,241,0.2)" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "0.3s"
            }}
          >
            <div style={{
              fontSize: "22px",
              background: "#222",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>{c.avatar}</div>
            <div>
              <div style={{ fontWeight: "500" }}>{c.name}</div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>{c.preview}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.border}`
      }}>
        {/* Header */}
        <div style={{
          padding: "16px",
          borderBottom: `1px solid ${theme.border}`,
          fontWeight: "600",
          fontSize: "18px",
          background: theme.inputBg,
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{
            fontSize: "22px",
            background: "#222",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {contacts.find(c => c.name === activeUser)?.avatar}
          </span>
          Chat with {activeUser}
        </div>

        {/* Chat messages */}
        <div style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}>
          {chatHistory.map((chat, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{
                alignSelf: "flex-end",
                background: theme.bubbleUser,
                padding: "12px 16px",
                borderRadius: "18px 18px 4px 18px",
                maxWidth: "70%",
                wordWrap: "break-word",
                color: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}>
                {chat.question}
              </div>
              <div style={{
                alignSelf: "flex-start",
                background: theme.bubbleBot,
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                maxWidth: "70%",
                wordWrap: "break-word",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}>
                {chat.answer}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "16px",
          display: "flex",
          gap: "10px",
          background: theme.inputBg,
          borderTop: `1px solid ${theme.border}`
        }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
              background: "#000",
              color: theme.text,
              outline: "none"
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button
            onClick={handleAsk}
            style={{
              padding: "12px 18px",
              borderRadius: "50%",
              background: theme.accent,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Sidebar Right */}
      <div style={{
        width: "260px",
        backdropFilter: "blur(8px)",
        background: theme.inputBg,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ fontWeight: "600", fontSize: "18px" }}>Customer Info</div>
        <div style={{ fontSize: "14px" }}>Name: {activeUser}</div>
        <div style={{ fontSize: "14px" }}>Email: {contacts.find(c => c.name === activeUser)?.email}</div>
        <div style={{ fontSize: "14px" }}>Phone: {contacts.find(c => c.name === activeUser)?.phone}</div>
        <div style={{ fontSize: "14px" }}>Tags: Buyer</div>
        <button style={{
          marginTop: "auto",
          padding: "12px",
          borderRadius: "8px",
          background: theme.accent,
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: "500",
          transition: "0.3s"
        }}>
          🚀 SEND TO CRM
        </button>
      </div>
    </div>
  );
}
