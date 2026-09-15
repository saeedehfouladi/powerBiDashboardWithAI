"use client";

import { useState } from "react";
import { FiSend, FiCpu, FiUser } from "react-icons/fi";

export default function AIChat({ dashboardContext }) {
  const sessionId = "dashboard-user";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const suggestedQuestions = [
    "بیشترین دارایی کدام است؟",
    "کمترین دارایی کدام است؟",
    "میانگین دارایی‌ها چقدر است؟",
    "دارایی‌ها در چه ماهی بیشترین مقدار را داشتند؟",
    "روند دارایی‌ها چگونه است؟",
    "بیشترین تعداد تیکت در کدام ماه بوده؟",
    "کمترین تعداد تیکت در کدام ماه بوده؟",
    "میانگین تیکت‌ها چقدر است؟",
    "روند تیکت‌ها چگونه است؟",
    "درصد رشد تیکت‌ها چقدر بوده؟",
    "مقدار تیکت ماه بعد چقدر پیش‌بینی می‌شود؟",
    "سه شاخص کلیدی این داشبورد چیست؟",
    "خلاصه وضعیت داشبورد را بگو",
    "مهم‌ترین نکات این گزارش چیست؟",
    "این نمودار چیست؟",
    "این نمودار چه چیزی را نشان می‌دهد؟",
  ];

  const sendMessage = async (question = message) => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
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
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "خطایی در دریافت پاسخ رخ داد.",
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.answer,
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-[360px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiCpu size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              AI Dashboard Copilot
            </h2>

            <p className="text-[10px] text-slate-400">
              دستیار هوشمند داشبورد
            </p>
          </div>

        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          آماده
        </div>

      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">

        {/* Suggested questions */}
        <div className="w-[38%] border-l border-slate-200 bg-slate-50/60 p-4">

          <p className="mb-3 text-xs font-semibold text-slate-600">
            سوال‌های آماده
          </p>

          <div className="flex max-h-[245px] flex-wrap content-start gap-1.5 overflow-y-auto">

            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {question}
              </button>
            ))}

          </div>

        </div>

        {/* Chat messages */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-white p-4">

          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiCpu size={20} />
                </div>

                <h3 className="text-xs font-semibold text-slate-700">
                  چطور می‌توانم کمکتان کنم؟
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  یکی از سوال‌های آماده را انتخاب کنید
                </p>

              </div>

            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={index}
                  className={`flex items-end gap-1.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >

                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FiCpu size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-3 py-2 text-xs leading-5 shadow-sm ${
                      isUser
                        ? "rounded-xl rounded-br-sm bg-blue-600 text-white"
                        : "rounded-xl rounded-bl-sm border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FiUser size={14} />
                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>

      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white px-4 py-3">

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 focus-within:border-blue-400 focus-within:bg-white">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="سوال خود را بنویسید..."
            className="flex-1 bg-transparent px-2 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-400"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!message.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiSend size={14} />
          </button>

        </div>

        <p className="mt-1 text-center text-[9px] text-slate-400">
          AI Dashboard Copilot • بر اساس داده‌های داشبورد
        </p>

      </div>

    </div>
  );
}