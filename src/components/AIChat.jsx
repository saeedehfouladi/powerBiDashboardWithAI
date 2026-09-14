"use client";

import { useState } from "react";

export default function AIChat({ dashboardContext }) {
  const sessionId = "dashboard-user";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  sessionId,
  messages: updatedMessages,
  dashboardContext,
})
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.answer,
      },
    ]);
  };

  return (
    <div className="p-4 bg-white rounded-xl">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="پیام خود را بنویسید..."
        className="border p-2"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 mr-2"
      >
        ارسال
      </button>

      <div className="space-y-3 mt-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "bg-blue-500 text-white p-3 rounded-lg"
                : "bg-gray-200 p-3 rounded-lg"
            }
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};