// Nama File: page.js (UI Diperbaiki, Backend Tetap Sama)
"use client";

import { useState, useRef, useEffect } from "react";

// Komponen kecil untuk animasi loading (...)
const LoadingDots = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <span style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0s' }}></span>
    <span style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.15s' }}></span>
    <span style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.3s' }}></span>
    <style jsx global>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
    `}</style>
  </div>
);


export default function ChatDashboard() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); 
  // --- STATE DIUBAH ---
  // Kita tidak lagi menggunakan isLoading global, tapi isResponding untuk menonaktifkan input
  const [isResponding, setIsResponding] = useState(false);
  const [activeUser, setActiveUser] = useState("Superman");
  const chatEndRef = useRef(null);

  const contacts = [
    { name: "Superman", preview: "Hello, I need help", email: "superman@gmail.com", phone: "(980) 444-9876", avatar: "🦸‍♂️" },
    { name: "Wonder Woman", preview: "Looking for a home", email: "wonderwoman@gmail.com", phone: "(980) 123-4567", avatar: "🦸‍♀️" },
    { name: "Black Widow", preview: "Can I talk to agent?", email: "blackwidow@gmail.com", phone: "(980) 765-4321", avatar: "🕷️" }
  ];

  // --- FUNGSI HANDLEASK DIUBAH TOTAL ---
  const handleAsk = async () => {
    if (!question.trim() || isResponding) return;

    const userMessage = { id: Date.now(), text: question, isUser: true };
    // Ini adalah "Pesan Placeholder" untuk jawaban bot
    const botMessagePlaceholder = { id: Date.now() + 1, text: "", isUser: false };
    
    // Langsung tampilkan pesan user dan placeholder bot yang kosong
    setMessages(prev => [...prev, userMessage, botMessagePlaceholder]);
    const currentQuestion = question; // Simpan pertanyaan saat ini
    setQuestion("");
    setIsResponding(true);

    try {
      // Backend tetap sama, tidak perlu diubah.
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuestion }),
      });

      if (!res.ok) throw new Error("Request gagal ke backend");

      const data = await res.json();

      // Cari placeholder di state dan isi dengan jawaban dari backend
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessagePlaceholder.id
            ? { ...msg, text: data.answer || "Server tidak memberikan jawaban." }
            : msg
        )
      );

    } catch (err) {
      console.error(err);
      // Jika error, isi placeholder dengan pesan error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessagePlaceholder.id
            ? { ...msg, text: "⚠️ Gagal terhubung ke server backend." }
            : msg
        )
      );
    } finally {
      setIsResponding(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      {/* Sidebar Left (Tidak diubah) */}
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

      {/* Chat Window (Ada perubahan kecil di bagian render pesan) */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.border}`
      }}>
        {/* Header (Tidak diubah) */}
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
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              style={{
                alignSelf: msg.isUser ? "flex-end" : "flex-start",
                background: msg.isUser ? theme.bubbleUser : theme.bubbleBot,
                padding: "12px 16px",
                borderRadius: msg.isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                maxWidth: "70%",
                wordWrap: "break-word",
                color: msg.isUser ? "#fff" : theme.text,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* --- LOGIKA RENDER PESAN DIUBAH --- */}
              {/* Jika pesan dari bot DAN teksnya kosong, tampilkan animasi loading */}
              {!msg.isUser && msg.text === "" ? (
                <LoadingDots />
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input (Ada perubahan kecil) */}
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
            disabled={isResponding}
          />
          <button
            onClick={handleAsk}
            style={{
              padding: "12px 18px",
              borderRadius: "50%",
              background: isResponding ? "#555" : theme.accent,
              color: "#fff",
              border: "none",
              cursor: isResponding ? "not-allowed" : "pointer",
              fontSize: "16px",
              transition: "0.3s"
            }}
            disabled={isResponding}
          >
            {isResponding ? "..." : "➤"}
          </button>
        </div>
      </div>

      {/* Sidebar Right (Tidak diubah) */}
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